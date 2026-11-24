import { RELEASES, compareVersions, featureVersion } from "./releases";

describe("RELEASES", () => {
  it("memakai versi valid, terbaru di atas, tanpa versi ganda", () => {
    const versions = RELEASES.map((r) => r.version);
    for (const v of versions) expect(v).toMatch(/^\d+\.\d+\.\d+$/);
    for (let i = 1; i < versions.length; i++) expect(compareVersions(versions[i - 1], versions[i])).toBeGreaterThan(0);
  });

  it("tiap fitur hanya terdaftar di satu versi", () => {
    const all: string[] = RELEASES.flatMap((r) => [...r.features]);
    expect(new Set(all).size).toBe(all.length);
  });

  it("featureVersion mengembalikan versi tempat fitur diperkenalkan", () => {
    expect(featureVersion("siswa-cari")).toBe("0.1.0");
    expect(featureVersion("siswa-tambah")).toBe("0.2.0");
  });
});

describe("compareVersions", () => {
  it("membandingkan angka per segmen, bukan teks", () => {
    expect(compareVersions("0.10.0", "0.9.0")).toBeGreaterThan(0);
    expect(compareVersions("1.0.0", "0.99.99")).toBeGreaterThan(0);
    expect(compareVersions("0.1.0", "0.2.0")).toBeLessThan(0);
    expect(compareVersions("0.2.0", "0.2.0")).toBe(0);
  });

  it("menganggap segmen yang hilang sebagai nol dan mengabaikan sufiks prerelease", () => {
    expect(compareVersions("1.2", "1.2.0")).toBe(0);
    expect(compareVersions("0.2.0-next.1", "0.2.0")).toBe(0);
  });
});
