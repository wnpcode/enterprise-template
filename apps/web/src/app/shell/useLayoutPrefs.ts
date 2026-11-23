import { useCallback, useState } from "react";
import { CHROME_STYLES, TONES, type ChromeStyle, type Tone } from "./chrome";

export type LayoutPrefs = {
  orientation: "vertical" | "horizontal";
  collapsed: boolean;
  sidebarType: "full" | "floating";
  sidebarSide: "left" | "right";
  sidebarTone: Tone;
  sidebarStyle: ChromeStyle;
  headerVisible: boolean;
  headerType: "sticky" | "static" | "floating";
  headerSpan: "full" | "inset";
  headerTone: Tone;
  headerStyle: ChromeStyle;
};

export const LAYOUT_STORAGE_KEY = "web-layout";

// default = tampilan sebelum konfigurasi ini ada: sidebar dan header melayang, header di samping sidebar
export const DEFAULT_PREFS: LayoutPrefs = {
  orientation: "vertical",
  collapsed: false,
  sidebarType: "floating",
  sidebarSide: "left",
  sidebarTone: "default",
  sidebarStyle: "solid",
  headerVisible: true,
  headerType: "floating",
  headerSpan: "inset",
  headerTone: "default",
  headerStyle: "solid",
};

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function readLayoutPrefs(): LayoutPrefs {
  try {
    const raw = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p: unknown = JSON.parse(raw);
    if (typeof p !== "object" || p === null) return DEFAULT_PREFS;
    const v = p as Record<string, unknown>;
    const d = DEFAULT_PREFS;
    return {
      orientation: v.orientation === "horizontal" ? "horizontal" : "vertical",
      collapsed: v.collapsed === true,
      sidebarType: oneOf(v.sidebarType, ["full", "floating"], d.sidebarType),
      sidebarSide: oneOf(v.sidebarSide, ["left", "right"], d.sidebarSide),
      sidebarTone: oneOf(v.sidebarTone, TONES, d.sidebarTone),
      sidebarStyle: oneOf(v.sidebarStyle, CHROME_STYLES, d.sidebarStyle),
      headerVisible: v.headerVisible !== false,
      headerType: oneOf(v.headerType, ["sticky", "static", "floating"], d.headerType),
      headerSpan: oneOf(v.headerSpan, ["full", "inset"], d.headerSpan),
      headerTone: oneOf(v.headerTone, TONES, d.headerTone),
      headerStyle: oneOf(v.headerStyle, CHROME_STYLES, d.headerStyle),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function useLayoutPrefs() {
  const [prefs, setPrefs] = useState<LayoutPrefs>(readLayoutPrefs);
  const update = useCallback((patch: Partial<LayoutPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage bisa penuh atau diblokir; preferensi tetap berlaku untuk sesi ini
      }
      return next;
    });
  }, []);
  return [prefs, update] as const;
}
