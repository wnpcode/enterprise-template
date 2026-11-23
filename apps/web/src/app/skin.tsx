import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export const SKIN_STORAGE_KEY = "web-skin";
export type Skin = "neo" | "flat" | "glass" | "clay" | "fluid" | "aurora" | "swiss";
const SKINS: readonly Skin[] = ["neo", "flat", "glass", "clay", "fluid", "aurora", "swiss"];
type SkinContextValue = { skin: Skin; setSkin: (next: Skin) => void };

const SkinContext = createContext<SkinContextValue | null>(null);

function readSkin(): Skin {
  try {
    const v = localStorage.getItem(SKIN_STORAGE_KEY) as Skin | null;
    return v && SKINS.includes(v) ? v : "neo";
  } catch {
    return "neo";
  }
}

export function SkinProvider({ children }: { children: (skin: Skin) => ReactNode }) {
  const [skin, setSkinState] = useState<Skin>(readSkin);
  const setSkin = useCallback((next: Skin) => {
    setSkinState(next);
    try {
      localStorage.setItem(SKIN_STORAGE_KEY, next);
    } catch {
      // preferensi tetap berlaku untuk sesi ini
    }
  }, []);
  const value = useMemo(() => ({ skin, setSkin }), [skin, setSkin]);
  return <SkinContext.Provider value={value}>{children(skin)}</SkinContext.Provider>;
}

export function useSkin() {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error("useSkin harus dipakai di dalam SkinProvider");
  return ctx;
}
