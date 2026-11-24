import { act, renderHook } from "@testing-library/react";
import { version as packageVersion } from "../../package.json";
import { ALL_PAGES, TOUR_STORAGE_KEY, selectTourSteps, useTour, type PageTourStep } from "./useTour";
import { RELEASES, type FeatureId } from "./releases";

// registry: 0.1.0 = siswa-cari, siswa-aksi; 0.2.0 = siswa-tambah
const step = (feature: FeatureId, target: string = feature): PageTourStep => ({
  feature,
  target: `[data-tour="${target}"]`,
  title: target,
  content: target,
});
const cari = step("siswa-cari");
const tambah = step("siswa-tambah");
const aksi = step("siswa-aksi");
// halaman: cari, tambah (tiga step), aksi
const semua = [cari, tambah, step("siswa-tambah", "nama"), step("siswa-tambah", "kelas"), aksi];
const features = (steps: PageTourStep[]) => steps.map((s) => s.feature);
const stored = () => JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) ?? "null");
const lihat = (seen: Record<string, string>) => localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(seen));

beforeEach(() => localStorage.removeItem(TOUR_STORAGE_KEY));

describe("selectTourSteps", () => {
  it("pengguna baru: semua fitur sampai versi sekarang", () => {
    expect(features(selectTourSteps(semua, { current: "0.2.0" }))).toEqual(features(semua));
  });

  it("menyembunyikan fitur yang versinya belum dideploy", () => {
    expect(features(selectTourSteps(semua, { current: "0.1.0" }))).toEqual(["siswa-cari", "siswa-aksi"]);
  });

  it("pengguna lama: hanya fitur yang lebih baru dari versi terakhir yang dilihat", () => {
    expect(features(selectTourSteps(semua, { seen: "0.1.0", current: "0.2.0" }))).toEqual(["siswa-tambah", "siswa-tambah", "siswa-tambah"]);
  });

  it("tidak ada yang diputar bila versi terakhir yang dilihat sama dengan versi sekarang", () => {
    expect(selectTourSteps(semua, { seen: "0.2.0", current: "0.2.0" })).toEqual([]);
  });

  it("all memutar semua fitur yang sudah dideploy, termasuk yang sudah dilihat", () => {
    expect(features(selectTourSteps(semua, { seen: "0.2.0", current: "0.2.0", all: true }))).toEqual(features(semua));
    expect(features(selectTourSteps(semua, { seen: "0.1.0", current: "0.1.0", all: true }))).toEqual(["siswa-cari", "siswa-aksi"]);
  });
});

describe("useTour", () => {
  it("terbuka sendiri setelah ready dengan semua fitur untuk pengguna baru", () => {
    const { result, rerender } = renderHook(({ ready }) => useTour("siswa", semua, { ready, version: "0.2.0" }), {
      initialProps: { ready: false },
    });
    expect(result.current.open).toBe(false);
    rerender({ ready: true });
    expect(result.current.open).toBe(true);
    expect(features(result.current.steps)).toEqual(features(semua));
  });

  it("menulis versi sekarang untuk halaman itu saat ditutup, dan tidak terbuka lagi setelah reload", () => {
    const first = renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" }));
    act(() => first.result.current.onOpenChange(false));
    expect(first.result.current.open).toBe(false);
    expect(stored()).toEqual({ siswa: "0.2.0" });

    expect(renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" })).result.current.open).toBe(false);
  });

  it("deploy versi baru: pengguna lama hanya melihat fitur versi itu, lalu tidak lagi", () => {
    // sebelum deploy: versi 0.1.0, pengguna menutup tur
    const before = renderHook(() => useTour("siswa", semua, { ready: true, version: "0.1.0" }));
    expect(features(before.result.current.steps)).toEqual(["siswa-cari", "siswa-aksi"]);
    act(() => before.result.current.onOpenChange(false));
    expect(stored()).toEqual({ siswa: "0.1.0" });

    // setelah deploy 0.2.0: hanya fitur baru
    const after = renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" }));
    expect(after.result.current.open).toBe(true);
    expect(features(after.result.current.steps)).toEqual(["siswa-tambah", "siswa-tambah", "siswa-tambah"]);
    act(() => after.result.current.onOpenChange(false));
    expect(stored()).toEqual({ siswa: "0.2.0" });
    expect(renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" })).result.current.open).toBe(false);
  });

  it("start memutar semua fitur yang sudah dideploy meski sudah dilihat", () => {
    lihat({ siswa: "0.2.0" });
    const { result } = renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" }));
    expect(result.current.open).toBe(false);
    act(() => result.current.start());
    expect(result.current.open).toBe(true);
    expect(features(result.current.steps)).toEqual(features(semua));
    act(() => result.current.onOpenChange(false));
    expect(result.current.open).toBe(false);
  });

  it("status per halaman: halaman lain tidak terpengaruh", () => {
    const siswa = renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" }));
    act(() => siswa.result.current.onOpenChange(false));
    expect(renderHook(() => useTour("kelas", semua, { ready: true, version: "0.2.0" })).result.current.open).toBe(true);
    expect(stored()).toEqual({ siswa: "0.2.0" });
  });

  it("penanda semua halaman mematikan tur otomatis sampai versi itu tapi start tetap jalan", () => {
    lihat({ [ALL_PAGES]: "0.2.0" });
    const { result } = renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" }));
    expect(result.current.open).toBe(false);
    act(() => result.current.start());
    expect(result.current.open).toBe(true);
  });

  it("tidak jatuh bila localStorage rusak atau berbentuk lama (array)", () => {
    for (const raw of ["{bukan json", '["siswa-cari"]', "null"]) {
      localStorage.setItem(TOUR_STORAGE_KEY, raw);
      expect(renderHook(() => useTour("siswa", semua, { ready: true, version: "0.2.0" })).result.current.open).toBe(true);
    }
  });
});

describe("APP_VERSION", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("build produksi memakai versi package.json; dev memakai rilis terbaru di registry", async () => {
    vi.stubEnv("DEV", false);
    vi.resetModules();
    expect((await import("./useTour")).APP_VERSION).toBe(packageVersion);

    vi.stubEnv("DEV", true);
    vi.resetModules();
    expect((await import("./useTour")).APP_VERSION).toBe(RELEASES[0].version);
  });
});
