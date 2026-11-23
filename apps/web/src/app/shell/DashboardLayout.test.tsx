import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { TooltipProvider } from "@enterprise/design-system";
import { AUTH_STORAGE_KEY, AuthProvider } from "../../features/auth/AuthProvider";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { DEFAULT_PREFS, LAYOUT_STORAGE_KEY, type LayoutPrefs } from "./useLayoutPrefs";

function renderWith(patch: Partial<LayoutPrefs>) {
  const prefs: LayoutPrefs = { ...DEFAULT_PREFS, ...patch };
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ refreshToken: "refresh.2.x", user: { id: 2, name: "Budi Guru", email: "guru@sekolah.id", roles: ["guru"] } }),
  );
  localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(prefs));
  return render(
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
    </MemoryRouter>,
  );
}

describe("DashboardLayout", () => {
  beforeEach(() => localStorage.clear());

  it("orientasi horizontal menaruh menu di header tanpa sidebar", () => {
    renderWith({ orientation: "horizontal", collapsed: false });
    expect(within(screen.getByRole("banner")).getByRole("link", { name: "Siswa" })).toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveTextContent("v0.1.0");
  });

  it("orientasi vertical menaruh menu di sidebar yang memuat versi, tanpa footer", () => {
    renderWith({ orientation: "vertical", collapsed: false });
    expect(within(screen.getByRole("complementary")).getByRole("link", { name: "Siswa" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent("v0.1.0");
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
  });

  it("sidebar ciut tidak menampilkan versi", () => {
    renderWith({ orientation: "vertical", collapsed: true });
    expect(screen.getByRole("complementary")).not.toHaveTextContent("v0.1.0");
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
});
