import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../features/auth";

/** `path` = pathname (kunci tab), `url` = pathname + search terakhir agar filter ikut dipulihkan. */
export type VisitedTab = { path: string; url: string };

export const MAX_TABS = 10;
// sessionStorage per user: tab hilang saat browser ditutup dan tidak bocor ke akun lain
export const tabsStorageKey = (userId: number | string) => `web-visited-tabs:${userId}`;

export function readTabs(key: string): VisitedTab[] {
  try {
    const p: unknown = JSON.parse(sessionStorage.getItem(key) ?? "[]");
    if (!Array.isArray(p)) return [];
    return p.filter(
      (t): t is VisitedTab =>
        typeof t?.path === "string" && typeof t?.url === "string" && t.path.startsWith("/app") && t.url.startsWith("/app"),
    );
  } catch {
    return [];
  }
}

export function upsertTab(tabs: VisitedTab[], tab: VisitedTab): VisitedTab[] {
  const i = tabs.findIndex((t) => t.path === tab.path);
  if (i >= 0) return tabs[i].url === tab.url ? tabs : tabs.map((t, j) => (j === i ? tab : t));
  return [...tabs, tab].slice(-MAX_TABS);
}

export function useVisitedTabs() {
  const { user } = useAuth();
  const key = tabsStorageKey(user?.id ?? "anon");
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const url = pathname + search;
  const [tabs, setTabs] = useState(() => upsertTab(readTabs(key), { path: pathname, url }));
  const [seenUrl, setSeenUrl] = useState(url);
  // catat lokasi baru saat render (bukan di effect) agar tab langsung tampil tanpa render ganda
  if (seenUrl !== url) {
    setSeenUrl(url);
    setTabs(upsertTab(tabs, { path: pathname, url }));
  }

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(tabs));
    } catch {
      // storage bisa penuh atau diblokir; tab tetap berlaku untuk sesi ini
    }
  }, [key, tabs]);

  const close = useCallback(
    (path: string) => {
      const i = tabs.findIndex((t) => t.path === path);
      const next = tabs.filter((t) => t.path !== path);
      setTabs(next);
      if (path === pathname) navigate(next[Math.min(i, next.length - 1)]?.url ?? "/app");
    },
    [tabs, pathname, navigate],
  );

  return { tabs, activePath: pathname, close };
}
