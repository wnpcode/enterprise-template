export const TONES = ["default", "muted", "inverse", "primary"] as const;
export const CHROME_STYLES = ["solid", "bordered", "transparent"] as const;

export type Tone = (typeof TONES)[number];
export type ChromeStyle = (typeof CHROME_STYLES)[number];

// warna preset (data-tone) hanya berlaku di style solid; bordered/transparent memakai latar halaman
export function toneAttr(style: ChromeStyle, tone: Tone) {
  return style === "solid" && tone !== "default" ? tone : undefined;
}

export function chromeClass(style: ChromeStyle) {
  if (style === "solid") return "bg-surface border-border";
  if (style === "bordered") return "bg-transparent border-border";
  return "bg-transparent border-transparent";
}

// tinggi header (min-h-14) dalam rem, plus margin 1rem di atas dan bawah untuk varian floating (md+)
export const HEADER_REM = 3.5;
export const FLOATING_HEADER_REM = 5.5;
