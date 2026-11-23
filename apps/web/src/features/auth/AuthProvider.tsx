import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, setAuthHooks } from "../../shared/api/client";
import * as authApi from "./api";
import type { LoginResponse, RegisterInput, User } from "./api";

export const AUTH_STORAGE_KEY = "web-auth";

type Session = { refreshToken: string; user: User };

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  /** Setelah profil diubah di server. */
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<Session>;
    const u = s.user as Partial<User> | undefined;
    const valid =
      typeof s.refreshToken === "string" && typeof u?.email === "string" && typeof u.name === "string" && Array.isArray(u.roles);
    return valid ? (s as Session) : null;
  } catch {
    return null;
  }
}

// shortcut: refresh token di localStorage (rawan XSS), pindah ke cookie httpOnly saat backend mendukung
function writeSession(session: Session | null) {
  if (session) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
}

// access token hanya di memori; hilang saat reload dan diperbarui lewat refresh token
let accessToken: string | null = null;
let refreshInflight: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  const session = readSession();
  if (!session) return Promise.resolve(false);
  // satu refresh untuk semua request 401 yang datang bersamaan
  refreshInflight ??= authApi
    .refresh(session.refreshToken)
    .then((t) => {
      accessToken = t.accessToken;
      writeSession({ ...(readSession() ?? session), refreshToken: t.refreshToken });
      return true;
    })
    // hanya jawaban 4xx yang berarti sesi tidak valid; galat jaringan dilempar agar sesi tidak dihapus
    .catch((e: unknown) => {
      if (e instanceof ApiError && e.status < 500) return false;
      throw e;
    })
    .finally(() => {
      refreshInflight = null;
    });
  return refreshInflight;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => readSession()?.user ?? null);

  const logout = useCallback(() => {
    accessToken = null;
    writeSession(null);
    setUserState(null);
  }, []);

  // didaftarkan sebelum anak pertama merender agar request pertama sudah membawa hook
  useState(() => setAuthHooks({ getToken: () => accessToken, refresh: refreshAccessToken, onUnauthorized: logout }));

  const setUser = useCallback((next: User) => {
    const s = readSession();
    if (s) writeSession({ ...s, user: next });
    setUserState(next);
  }, []);

  const startSession = useCallback((res: LoginResponse) => {
    accessToken = res.accessToken;
    writeSession({ refreshToken: res.refreshToken, user: res.user });
    setUserState(res.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => startSession(await authApi.login({ email, password })),
    [startSession],
  );
  const register = useCallback(async (input: RegisterInput) => startSession(await authApi.register(input)), [startSession]);

  // sesi tersimpan dipakai dulu (optimis), lalu diverifikasi: perbarui token dan ambil profil terbaru;
  // ditolak server (4xx) → keluar; galat jaringan atau fetch dibatalkan (reload) → sesi dibiarkan
  useEffect(() => {
    if (!readSession()) return;
    let active = true;
    refreshAccessToken()
      .then((ok) => (ok ? authApi.fetchMe() : null))
      .then((u) => {
        if (!active) return;
        if (u) setUser(u);
        else logout();
      })
      .catch((e: unknown) => {
        if (active && e instanceof ApiError && e.status < 500) logout();
      });
    return () => {
      active = false;
    };
  }, [setUser, logout]);

  const value = useMemo(() => ({ user, login, register, logout, setUser }), [user, login, register, logout, setUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
