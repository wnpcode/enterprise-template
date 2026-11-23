import type { HeaderConfig, ShellConfig, SidebarConfig } from "./config";

export type PresetId = "classic" | "admin" | "corporate" | "compact" | "topnav" | "minimal";

const baseSidebar: SidebarConfig = { visible: true, type: "floating", side: "left", collapsed: false, tone: "default", style: "solid" };
const baseHeader: HeaderConfig = { visible: true, type: "floating", span: "inset", tone: "default", style: "solid" };

const make = (sidebar: Partial<SidebarConfig>, header: Partial<HeaderConfig>): ShellConfig => ({
  sidebar: { ...baseSidebar, ...sidebar },
  header: { ...baseHeader, ...header },
});

// enam preset yang sama dengan apps/web/src/app/shell/presets.ts; topnav = sidebar disembunyikan
export const PRESETS: { id: PresetId; label: string; config: ShellConfig }[] = [
  { id: "classic", label: "Klasik", config: make({}, {}) },
  { id: "admin", label: "Admin", config: make({ type: "full", tone: "inverse" }, { type: "sticky" }) },
  { id: "corporate", label: "Korporat", config: make({ type: "full", tone: "muted" }, { type: "sticky", span: "full", tone: "primary" }) },
  { id: "compact", label: "Ringkas", config: make({ type: "full", collapsed: true }, { type: "sticky", style: "bordered" }) },
  { id: "topnav", label: "Menu atas", config: make({ visible: false }, { type: "sticky", span: "full" }) },
  { id: "minimal", label: "Minimal", config: make({ type: "full", style: "bordered" }, { type: "static", style: "transparent" }) },
];

const same = (a: object, b: object) => Object.entries(a).every(([k, v]) => (b as Record<string, unknown>)[k] === v);

export function matchPreset(config: ShellConfig): PresetId | "custom" {
  return PRESETS.find((p) => same(p.config.sidebar, config.sidebar) && same(p.config.header, config.header))?.id ?? "custom";
}
