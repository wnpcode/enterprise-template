import { DEFAULT_PREFS, type LayoutPrefs } from "./useLayoutPrefs";

export type PresetId = "classic" | "admin" | "corporate" | "compact" | "topnav" | "minimal";

const preset = (override: Partial<LayoutPrefs>): LayoutPrefs => ({ ...DEFAULT_PREFS, ...override });

// kombinasi terkurasi dari konfigurasi shell; daftar yang sama ada di apps/playground/src/shell/presets.ts
// aturan (dites): warna selain default hanya di style solid, style transparent hanya dengan header static
export const LAYOUT_PRESETS: { id: PresetId; prefs: LayoutPrefs }[] = [
  { id: "classic", prefs: preset({}) },
  { id: "admin", prefs: preset({ sidebarType: "full", sidebarTone: "inverse", headerType: "sticky" }) },
  {
    id: "corporate",
    prefs: preset({ sidebarType: "full", sidebarTone: "muted", headerType: "sticky", headerSpan: "full", headerTone: "primary" }),
  },
  { id: "compact", prefs: preset({ sidebarType: "full", collapsed: true, headerType: "sticky", headerStyle: "bordered" }) },
  { id: "topnav", prefs: preset({ orientation: "horizontal", headerType: "sticky", headerSpan: "full" }) },
  {
    id: "minimal",
    prefs: preset({ sidebarType: "full", sidebarStyle: "bordered", headerType: "static", headerStyle: "transparent" }),
  },
];

const KEYS = Object.keys(DEFAULT_PREFS) as (keyof LayoutPrefs)[];

export function matchPreset(prefs: LayoutPrefs): PresetId | "custom" {
  return LAYOUT_PRESETS.find((p) => KEYS.every((k) => p.prefs[k] === prefs[k]))?.id ?? "custom";
}
