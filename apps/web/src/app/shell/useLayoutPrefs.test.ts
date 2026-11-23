import { act, renderHook } from "@testing-library/react";
import { DEFAULT_PREFS, LAYOUT_STORAGE_KEY, useLayoutPrefs } from "./useLayoutPrefs";

describe("useLayoutPrefs", () => {
  beforeEach(() => localStorage.clear());

  it("memakai default vertical, tidak diciutkan, sidebar dan header melayang", () => {
    const { result } = renderHook(() => useLayoutPrefs());
    expect(result.current[0]).toEqual(DEFAULT_PREFS);
    expect(DEFAULT_PREFS).toMatchObject({
      orientation: "vertical",
      collapsed: false,
      sidebarType: "floating",
      headerType: "floating",
      headerSpan: "inset",
    });
  });

  it("menyimpan perubahan ke localStorage", () => {
    const { result } = renderHook(() => useLayoutPrefs());
    act(() => result.current[1]({ collapsed: true }));
    expect(result.current[0].collapsed).toBe(true);
    expect(JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) ?? "{}")).toEqual({ ...DEFAULT_PREFS, collapsed: true });
  });

  it("kembali ke default bila JSON rusak", () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, "{");
    const { result } = renderHook(() => useLayoutPrefs());
    expect(result.current[0]).toEqual(DEFAULT_PREFS);
  });

  it("memakai vertical bila orientation tidak dikenal", () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify({ orientation: "diagonal", collapsed: true }));
    const { result } = renderHook(() => useLayoutPrefs());
    expect(result.current[0].orientation).toBe("vertical");
  });

  it("data lama tanpa field baru tetap terbaca dengan default untuk field baru", () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify({ orientation: "horizontal", collapsed: true }));
    const { result } = renderHook(() => useLayoutPrefs());
    expect(result.current[0]).toEqual({ ...DEFAULT_PREFS, orientation: "horizontal", collapsed: true });
  });

  it("nilai field baru yang tidak dikenal kembali ke default, nilai valid dipertahankan", () => {
    localStorage.setItem(
      LAYOUT_STORAGE_KEY,
      JSON.stringify({ sidebarSide: "right", sidebarTone: "neon", headerStyle: "bordered", headerType: 5, headerVisible: false }),
    );
    const { result } = renderHook(() => useLayoutPrefs());
    expect(result.current[0]).toMatchObject({
      sidebarSide: "right",
      sidebarTone: DEFAULT_PREFS.sidebarTone,
      headerStyle: "bordered",
      headerType: DEFAULT_PREFS.headerType,
      headerVisible: false,
    });
  });
});
