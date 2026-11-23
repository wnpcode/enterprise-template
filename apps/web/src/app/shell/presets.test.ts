import { DEFAULT_PREFS, LAYOUT_STORAGE_KEY, readLayoutPrefs } from "./useLayoutPrefs";
import { LAYOUT_PRESETS, matchPreset } from "./presets";

describe("LAYOUT_PRESETS", () => {
  it("id unik dan tidak ada konfigurasi yang kembar", () => {
    expect(new Set(LAYOUT_PRESETS.map((p) => p.id)).size).toBe(LAYOUT_PRESETS.length);
    expect(new Set(LAYOUT_PRESETS.map((p) => JSON.stringify(p.prefs))).size).toBe(LAYOUT_PRESETS.length);
  });

  it("classic sama dengan default", () => {
    expect(LAYOUT_PRESETS[0]).toEqual({ id: "classic", prefs: DEFAULT_PREFS });
    expect(matchPreset(DEFAULT_PREFS)).toBe("classic");
  });

  it.each(LAYOUT_PRESETS)("$id: nilai valid, warna hanya di solid, transparan hanya dengan header static", ({ id, prefs }) => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(prefs));
    expect(readLayoutPrefs()).toEqual(prefs);
    if (prefs.sidebarStyle !== "solid") expect(prefs.sidebarTone).toBe("default");
    if (prefs.headerStyle !== "solid") expect(prefs.headerTone).toBe("default");
    if (prefs.headerStyle === "transparent") expect(prefs.headerType).toBe("static");
    if (prefs.orientation === "horizontal") expect(prefs.headerVisible).toBe(true);
    expect(matchPreset(prefs)).toBe(id);
    localStorage.clear();
  });

  it("mengubah satu field membuat tema jadi custom", () => {
    expect(matchPreset({ ...LAYOUT_PRESETS[1].prefs, sidebarSide: "right" })).toBe("custom");
  });
});
