import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { AUTH_STORAGE_KEY, AuthProvider } from "../../features/auth/AuthProvider";
import { BottomNav } from "./BottomNav";

const Lokasi = () => <p data-testid="lokasi">{useLocation().pathname}</p>;

function renderNav(roles: string[]) {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      refreshToken: "refresh.2.x",
      user: { id: 2, name: "Budi Guru", email: "guru@sekolah.id", roles },
      companies: [{ id: 1, name: "SMA Harapan Bangsa" }],
      companyId: 1,
    }),
  );
  return render(
    <MemoryRouter initialEntries={["/app"]}>
      <AuthProvider>
        <BottomNav />
        <Lokasi />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("BottomNav", () => {
  beforeEach(() => localStorage.clear());

  it("Reporting membuka popup berisi anak-anaknya lalu berpindah route", async () => {
    const user = userEvent.setup();
    renderNav(["guru"]);
    await user.click(screen.getByRole("button", { name: "Reporting" }));
    expect(await screen.findByRole("menuitem", { name: "Laporan Siswa" })).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Laporan Pendaftaran" }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/app/reporting/pendaftaran");
  });

  it("item tanpa anak tetap berupa link, dan item mobile:false tidak tampil", () => {
    renderNav(["admin"]);
    expect(screen.getByRole("link", { name: "Siswa" })).toHaveAttribute("href", "/app/siswa");
    expect(screen.queryByRole("link", { name: "Komponen" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Konfigurasi" })).toHaveAttribute("href", "/app/konfigurasi-company");
  });
});
