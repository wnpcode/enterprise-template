import { MAX_TABS, readTabs, upsertTab } from "./useVisitedTabs";
import { tabLabel } from "./VisitedTabs";

describe("visited tabs", () => {
  beforeEach(() => sessionStorage.clear());

  it("memperbarui url tab yang sudah ada tanpa mengubah urutan", () => {
    const tabs = [
      { path: "/app", url: "/app" },
      { path: "/app/siswa", url: "/app/siswa" },
    ];
    expect(upsertTab(tabs, { path: "/app/siswa", url: "/app/siswa?q=budi" })).toEqual([
      { path: "/app", url: "/app" },
      { path: "/app/siswa", url: "/app/siswa?q=budi" },
    ]);
  });

  it(`membatasi ${MAX_TABS} tab dan membuang yang paling lama`, () => {
    let tabs = Array.from({ length: MAX_TABS }, (_, i) => ({ path: `/app/x${i}`, url: `/app/x${i}` }));
    tabs = upsertTab(tabs, { path: "/app/baru", url: "/app/baru" });
    expect(tabs).toHaveLength(MAX_TABS);
    expect(tabs[0].path).toBe("/app/x1");
    expect(tabs.at(-1)?.path).toBe("/app/baru");
  });

  it("storage rusak atau berisi data asing menghasilkan daftar kosong", () => {
    sessionStorage.setItem("k", "{rusak");
    expect(readTabs("k")).toEqual([]);
    sessionStorage.setItem("k", JSON.stringify([{ path: "https://jahat", url: "x" }, { path: 1 }]));
    expect(readTabs("k")).toEqual([]);
  });

  it("membuang tab yang url-nya keluar dari /app (tidak boleh jadi tujuan navigasi)", () => {
    sessionStorage.setItem(
      "k",
      JSON.stringify([
        { path: "/app/siswa", url: "//jahat.example/x" },
        { path: "/app/siswa", url: "https://jahat.example" },
        { path: "/app/siswa", url: "/app/siswa?q=budi" },
      ]),
    );
    expect(readTabs("k")).toEqual([{ path: "/app/siswa", url: "/app/siswa?q=budi" }]);
  });

  it("label diambil dari nav dengan sisa segmen sebagai suffix", () => {
    expect(tabLabel("/app")).toEqual({ key: "nav.dashboard", suffix: "" });
    expect(tabLabel("/app/komponen/button")).toEqual({ key: "nav.komponen", suffix: "button" });
    expect(tabLabel("/app/profil")).toEqual({ key: "account.profile", suffix: "" });
    expect(tabLabel("/app/reporting/siswa")).toEqual({ key: "nav.reportingSiswa", suffix: "" });
    expect(tabLabel("/app/tidak-ada")).toBeNull();
  });
});
