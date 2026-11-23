import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, setAuthHooks } from "../../shared/api/client";
import * as authApi from "./api";
import type { AuthTokens, Company, RegisterInput, User } from "./api";

export const AUTH_STORAGE_KEY = "web-auth";

type Session = { refreshToken: string; user: User; companies: Company[]; companyId: number | null };

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  /** Setelah profil diubah di server. */
  setUser: (user: User) => void;
  /** Daftar company hasil login (superadmin: semua; role lain: satu milik user). */
  companies: Company[];
  /** Company terpilih; null bila belum login. */
  company: Company | null;
  selectCompany: (id: number) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<Session>;
    const u = s.user as Partial<User> | undefined;
    const valid =
      typeof s.refreshToken === "string" &&
      typeof u?.email === "string" &&
      typeof u.name === "string" &&
      Array.isArray(u.roles) &&
      Array.isArray(s.companies);
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
let currentCompanyId: number | null = null;
let refreshInflight: Promise<boolean> | null = null;
// 4xx berarti sesi ditolak, kecuali 408/429 yang hanya sementara (rate limit tidak boleh mengeluarkan pengguna)
const sessionRejected = (e: unknown): e is ApiError => e instanceof ApiError && e.status < 500 && e.status !== 408 && e.status !== 429;
// naik setiap logout: hasil request lama (refresh/fetchMe) tidak boleh menghidupkan lagi sesi yang sudah ditutup
let sessionEpoch = 0;

function refreshAccessToken(): Promise<boolean> {
  const session = readSession();
  if (!session) return Promise.resolve(false);
  const epoch = sessionEpoch;
  // satu refresh untuk semua request 401 yang datang bersamaan
  refreshInflight ??= authApi
    .refresh(session.refreshToken)
    .then((t) => {
      const current = readSession();
      // logout (di tab ini atau tab lain) terjadi selagi menunggu: jangan tulis ulang sesi yang sudah dihapus
      if (epoch !== sessionEpoch || !current) return false;
      accessToken = t.accessToken;
      writeSession({ ...current, refreshToken: t.refreshToken });
      return true;
    })
    // hanya jawaban 4xx yang berarti sesi tidak valid; galat jaringan dilempar agar sesi tidak dihapus
    .catch((e: unknown) => {
      if (sessionRejected(e)) return false;
      throw e;
    })
    .finally(() => {
      refreshInflight = null;
    });
  return refreshInflight;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => readSession()?.user ?? null);
  const [companies, setCompanies] = useState<Company[]>(() => readSession()?.companies ?? []);
  const [companyId, setCompanyId] = useState<number | null>(() => readSession()?.companyId ?? null);

  const logout = useCallback(() => {
    sessionEpoch++;
    refreshInflight = null;
    accessToken = null;
    currentCompanyId = null;
    writeSession(null);
    setUserState(null);
    setCompanies([]);
    setCompanyId(null);
  }, []);

  // didaftarkan sebelum anak pertama merender agar request pertama sudah membawa hook
  useState(() => {
    currentCompanyId = readSession()?.companyId ?? null;
    setAuthHooks({
      getToken: () => accessToken,
      refresh: refreshAccessToken,
      onUnauthorized: logout,
      getCompanyId: () => currentCompanyId,
    });
  });

  const setUser = useCallback((next: User) => {
    const s = readSession();
    if (s) writeSession({ ...s, user: next });
    setUserState(next);
  }, []);

  // daftar company diambil sekali di sini dan disimpan di sesi; reload tidak mengambilnya lagi
  const startSession = useCallback(async (res: AuthTokens & { user: User }) => {
    accessToken = res.accessToken;
    try {
      const list = await authApi.fetchCompanies();
      const selected = list.items.find((c) => c.id === list.defaultId) ?? list.items[0];
      currentCompanyId = selected?.id ?? null;
      writeSession({ refreshToken: res.refreshToken, user: res.user, companies: list.items, companyId: currentCompanyId });
      setCompanies(list.items);
      setCompanyId(currentCompanyId);
      setUserState(res.user);
    } catch (e) {
      // login dianggap gagal bila company tidak bisa dimuat; jangan tinggalkan token tanpa sesi
      accessToken = null;
      throw e;
    }
  }, []);

  const selectCompany = useCallback((id: number) => {
    const s = readSession();
    if (!s || !s.companies.some((c) => c.id === id)) return;
    currentCompanyId = id;
    writeSession({ ...s, companyId: id });
    setCompanyId(id);
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
    const epoch = sessionEpoch;
    // `active` hanya mati saat unmount; logout selagi menunggu ditangkap lewat epoch
    const stale = () => !active || epoch !== sessionEpoch;
    refreshAccessToken()
      .then((ok) => (ok ? authApi.fetchMe() : null))
      .then((u) => {
        if (stale()) return;
        if (u) setUser(u);
        else logout();
      })
      .catch((e: unknown) => {
        if (!stale() && sessionRejected(e)) logout();
      });
    return () => {
      active = false;
    };
  }, [setUser, logout]);

  const company = useMemo(() => companies.find((c) => c.id === companyId) ?? null, [companies, companyId]);
  const value = useMemo(
    () => ({ user, login, register, logout, setUser, companies, company, selectCompany }),
    [user, login, register, logout, setUser, companies, company, selectCompany],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
