import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "ds-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/* Dipasang consumer sebagai <script> inline di <head> agar tidak ada flash tema salah. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("${DARK_QUERY}").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" || value === "system" ? value : null;
  } catch {
    return null;
  }
}

function readSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Dipakai bila belum ada preferensi tersimpan. */
  defaultTheme?: Theme;
  /** Nilai untuk atribut data-brand di <html>; undefined menghapusnya. */
  brand?: string;
  /** Nilai untuk atribut data-skin di <html> (mis. "neo"); undefined menghapusnya. */
  skin?: string;
}

export function ThemeProvider({ children, defaultTheme = "system", brand, skin }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme() ?? defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystemTheme);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!brand) return;
    document.documentElement.dataset.brand = brand;
    return () => {
      delete document.documentElement.dataset.brand;
    };
  }, [brand]);

  useEffect(() => {
    if (!skin) return;
    document.documentElement.dataset.skin = skin;
    return () => {
      delete document.documentElement.dataset.skin;
    };
  }, [skin]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage tidak tersedia (private mode); state tetap jalan */
    }
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme harus dipakai di dalam <ThemeProvider>");
  return context;
}
