import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { TooltipProvider } from "@wnp_code/design-system";
import { version } from "../../../package.json";
import { AUTH_STORAGE_KEY, AuthProvider } from "../../features/auth/AuthProvider";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { DEFAULT_PREFS, LAYOUT_STORAGE_KEY, type LayoutPrefs } from "./useLayoutPrefs";

const SMA = { id: 1, name: "SMA Harapan Bangsa" };
const SMP = { id: 2, name: "SMP Cahaya Ilmu" };
const guru = {
  refreshToken: "refresh.2.x",
  user: { id: 2, name: "Budi Guru", email: "guru@sekolah.id", roles: ["guru"] },
  companies: [SMA],
  companyId: 1,
};
const superadmin = {
  refreshToken: "refresh.3.x",
  user: { id: 3, name: "Sari Superadmin", email: "superadmin@sekolah.id", roles: ["superadmin"] },
  companies: [SMA, SMP],
  companyId: 1,
};

function renderWith(patch: Partial<LayoutPrefs>, session: object = guru) {
  const prefs: LayoutPrefs = { ...DEFAULT_PREFS, ...patch };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(prefs));
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={["/app"]}>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="app" element={<DashboardLayout />}>
                <Route index element={<p>Isi</p>} />
              </Route>
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("DashboardLayout", () => {
  beforeEach(() => localStorage.clear());

  it("orientasi horizontal menaruh menu di header tanpa sidebar", () => {
    renderWith({ orientation: "horizontal", collapsed: false });
    expect(within(screen.getByRole("banner")).getByRole("link", { name: "Siswa" })).toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveTextContent(`v${version}`);
  });

  it("orientasi vertical menaruh menu di sidebar yang memuat versi, tanpa footer", () => {
    renderWith({ orientation: "vertical", collapsed: false });
    expect(within(screen.getByRole("complementary")).getByRole("link", { name: "Siswa" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent(`v${version}`);
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
  });

  it("sidebar ciut tidak menampilkan versi", () => {
    renderWith({ orientation: "vertical", collapsed: true });
    expect(screen.getByRole("complementary")).not.toHaveTextContent(`v${version}`);
  });

  it("header disembunyikan memindahkan menu akun ke footer sidebar", () => {
    renderWith({ orientation: "vertical", headerVisible: false });
    expect(screen.getByRole("banner")).toHaveClass("md:hidden");
    expect(within(screen.getByRole("complementary")).getByRole("button", { name: "Budi Guru" })).toBeInTheDocument();
  });

  it("header tampil membuat menu akun tetap di header, bukan di sidebar", () => {
    renderWith({ orientation: "vertical", headerVisible: true });
    expect(within(screen.getByRole("banner")).getByRole("button", { name: /Budi Guru/ })).toBeInTheDocument();
    expect(within(screen.getByRole("complementary")).queryByRole("button", { name: "Budi Guru" })).not.toBeInTheDocument();
  });

  it("orientasi horizontal memaksa header tampil walau headerVisible false", () => {
    renderWith({ orientation: "horizontal", headerVisible: false });
    expect(screen.getByRole("banner")).not.toHaveClass("md:hidden");
    expect(within(screen.getByRole("banner")).getByRole("link", { name: "Siswa" })).toBeInTheDocument();
  });

  it("sidebar di kanan membalik urutan kolom", () => {
    const { container } = renderWith({ sidebarSide: "right" });
    expect(container.querySelector(".md\\:flex-row-reverse")).not.toBeNull();
  });

  it("warna preset dipasang sebagai data-tone hanya pada style solid", () => {
    renderWith({ sidebarTone: "inverse", sidebarStyle: "solid", headerTone: "primary", headerStyle: "bordered" });
    expect(screen.getByRole("complementary")).toHaveAttribute("data-tone", "inverse");
    expect(screen.getByRole("banner")).not.toHaveAttribute("data-tone");
  });

  it("superadmin mencari dan mengganti company lewat combobox di header, pilihannya tersimpan", async () => {
    const user = userEvent.setup();
    renderWith({ orientation: "vertical", headerVisible: true }, superadmin);
    const header = within(screen.getByRole("banner"));
    expect(header.getByRole("combobox", { name: "Ganti perusahaan" })).toHaveTextContent(SMA.name);
    await user.click(header.getByRole("combobox", { name: "Ganti perusahaan" }));
    await user.type(screen.getByPlaceholderText("Cari perusahaan"), "Cahaya");
    expect(screen.queryByRole("option", { name: SMA.name })).not.toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: SMP.name }));
    expect(header.getByRole("combobox", { name: "Ganti perusahaan" })).toHaveTextContent(SMP.name);
    expect(JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null").companyId).toBe(2);
  });

  it("role dengan satu company tidak melihat pemilih company", () => {
    renderWith({ orientation: "vertical", headerVisible: true });
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("header disembunyikan memindahkan pemilih company ke footer sidebar, kecuali saat diciutkan", () => {
    const { unmount } = renderWith({ orientation: "vertical", headerVisible: false, collapsed: false }, superadmin);
    expect(within(screen.getByRole("complementary")).getByRole("combobox", { name: "Ganti perusahaan" })).toBeInTheDocument();
    unmount();
    renderWith({ orientation: "vertical", headerVisible: false, collapsed: true }, superadmin);
    expect(within(screen.getByRole("complementary")).queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("grup Reporting di sidebar terbuka bisa dilipat dan memuat menu anak", async () => {
    const user = userEvent.setup();
    renderWith({ orientation: "vertical", collapsed: false });
    const sidebar = within(screen.getByRole("complementary"));
    const grup = sidebar.getByRole("button", { name: "Reporting" });
    expect(grup).toHaveAttribute("aria-expanded", "false");
    expect(sidebar.queryByRole("link", { name: "Laporan Siswa" })).not.toBeInTheDocument();
    await user.click(grup);
    expect(grup).toHaveAttribute("aria-expanded", "true");
    expect(sidebar.getByRole("link", { name: "Laporan Siswa" })).toHaveAttribute("href", "/app/reporting/siswa");
    expect(sidebar.getByRole("link", { name: "Laporan Pendaftaran" })).toBeInTheDocument();
  });

  it("grup Reporting jadi menu popup saat sidebar diciutkan", async () => {
    const user = userEvent.setup();
    renderWith({ orientation: "vertical", collapsed: true });
    await user.click(within(screen.getByRole("complementary")).getByRole("button", { name: "Reporting" }));
    expect(await screen.findByRole("menuitem", { name: "Laporan Siswa" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Laporan Pendaftaran" })).toBeInTheDocument();
  });

  it("grup Reporting jadi menu popup di header horizontal", async () => {
    const user = userEvent.setup();
    renderWith({ orientation: "horizontal", collapsed: false });
    await user.click(within(screen.getByRole("banner")).getByRole("button", { name: "Reporting" }));
    expect(await screen.findByRole("menuitem", { name: "Laporan Siswa" })).toBeInTheDocument();
  });

  it("header horizontal memakai label pendek agar menu tidak membungkus", () => {
    renderWith({ orientation: "horizontal" }, superadmin);
    const banner = within(screen.getByRole("banner"));
    expect(banner.getByRole("link", { name: "Konfigurasi" })).toBeInTheDocument();
    expect(banner.queryByRole("link", { name: "Konfigurasi Company" })).not.toBeInTheDocument();
  });

  it("Konfigurasi Company hanya untuk admin dan superadmin", () => {
    const { unmount } = renderWith({ orientation: "vertical" });
    expect(within(screen.getByRole("complementary")).queryByRole("link", { name: "Konfigurasi Company" })).not.toBeInTheDocument();
    unmount();
    renderWith({ orientation: "vertical" }, superadmin);
    expect(within(screen.getByRole("complementary")).getByRole("link", { name: "Konfigurasi Company" })).toHaveAttribute(
      "href",
      "/app/konfigurasi-company",
    );
  });
});
