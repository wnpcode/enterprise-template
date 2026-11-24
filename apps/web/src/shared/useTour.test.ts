import { act, renderHook } from "@testing-library/react";
import { ALL_TOURS_SEEN, TOUR_STORAGE_KEY, useTour, type PageTourStep } from "./useTour";

const step = (feature: string, target = feature): PageTourStep => ({
  feature,
  target: `[data-tour="${target}"]`,
  title: target,
  content: target,
});
const cari = step("siswa-cari");
const tambah = step("siswa-tambah");
const aksi = step("siswa-aksi");
// fitur "tambah" punya tiga step (tombol, nama, kelas)
const semua = [cari, tambah, step("siswa-tambah", "nama"), step("siswa-tambah", "kelas"), aksi];
const ids = (steps: PageTourStep[]) => steps.map((s) => s.feature);
const fitur = [...new Set(ids(semua))];
const stored = () => JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) ?? "[]");

beforeEach(() => localStorage.removeItem(TOUR_STORAGE_KEY));

describe("useTour", () => {
  it("terbuka sendiri setelah ready dengan semua step bila belum ada yang dilihat", () => {
    const { result, rerender } = renderHook(({ ready }) => useTour(semua, { ready }), { initialProps: { ready: false } });
    expect(result.current.open).toBe(false);
    rerender({ ready: true });
    expect(result.current.open).toBe(true);
    expect(ids(result.current.steps)).toEqual(ids(semua));
  });

  it("mencatat semua step yang diputar saat ditutup dan tidak terbuka lagi setelah reload", () => {
    const first = renderHook(() => useTour(semua, { ready: true }));
    act(() => first.result.current.onOpenChange(false));
    expect(first.result.current.open).toBe(false);
    expect(stored()).toEqual(fitur);

    expect(renderHook(() => useTour(semua, { ready: true })).result.current.open).toBe(false);
  });

  it("hanya memutar step baru untuk pengguna lama", () => {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(["siswa-cari", "siswa-tambah"]));
    const { result } = renderHook(() => useTour(semua, { ready: true }));
    expect(result.current.open).toBe(true);
    expect(ids(result.current.steps)).toEqual(["siswa-aksi"]);

    act(() => result.current.onOpenChange(false));
    expect(stored()).toEqual(fitur);
  });

  it("satu fitur dengan beberapa step tampil utuh atau tidak sama sekali", () => {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(["siswa-cari", "siswa-aksi"]));
    const { result } = renderHook(() => useTour(semua, { ready: true }));
    expect(result.current.steps.map((s) => s.target)).toEqual(['[data-tour="siswa-tambah"]', '[data-tour="nama"]', '[data-tour="kelas"]']);
  });

  it("start memutar semua step meski sudah dilihat", () => {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(fitur));
    const { result } = renderHook(() => useTour(semua, { ready: true }));
    expect(result.current.open).toBe(false);
    act(() => result.current.start());
    expect(result.current.open).toBe(true);
    expect(ids(result.current.steps)).toEqual(ids(semua));
    act(() => result.current.onOpenChange(false));
    expect(result.current.open).toBe(false);
  });

  it("penanda semua-dilihat mematikan tur otomatis tapi start tetap jalan", () => {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify([ALL_TOURS_SEEN]));
    const { result } = renderHook(() => useTour(semua, { ready: true }));
    expect(result.current.open).toBe(false);
    act(() => result.current.start());
    expect(result.current.open).toBe(true);
  });

  it("tidak jatuh bila localStorage rusak", () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "{bukan json");
    expect(renderHook(() => useTour(semua, { ready: true })).result.current.open).toBe(true);
  });
});
