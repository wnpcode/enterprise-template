import { createContext, useContext } from "react";

export type Tone = "default" | "muted" | "inverse" | "primary";
export type ChromeStyle = "solid" | "bordered" | "transparent";

export type SidebarConfig = {
  visible: boolean;
  type: "full" | "floating";
  side: "left" | "right";
  collapsed: boolean;
  tone: Tone;
  style: ChromeStyle;
};

export type HeaderConfig = {
  visible: boolean;
  type: "sticky" | "static" | "floating";
  span: "full" | "inset";
  tone: Tone;
  style: ChromeStyle;
};

export type ShellConfig = { sidebar: SidebarConfig; header: HeaderConfig };

export const defaultShell: ShellConfig = {
  sidebar: { visible: true, type: "full", side: "left", collapsed: false, tone: "default", style: "solid" },
  header: { visible: true, type: "sticky", span: "full", tone: "default", style: "solid" },
};

/* Warna preset hanya berlaku di style solid; bordered/transparent memakai latar halaman, jadi tone tidak dipasang. */
export function toneAttr(style: ChromeStyle, tone: Tone) {
  return style === "solid" && tone !== "default" ? tone : undefined;
}

export function chromeClass(style: ChromeStyle) {
  if (style === "solid") return "bg-surface border-border";
  if (style === "bordered") return "bg-transparent border-border";
  return "bg-transparent border-transparent";
}

type ShellContextValue = { config: ShellConfig; setConfig: (next: ShellConfig) => void; openPanel: () => void };

export const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell harus dipakai di dalam ShellContext.Provider");
  return ctx;
}
