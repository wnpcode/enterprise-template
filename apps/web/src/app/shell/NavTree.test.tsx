import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Layers } from "lucide-react";
import { MemoryRouter, useLocation } from "react-router";
import { TooltipProvider } from "@wnpcode/design-system";
import type { NavItem } from "./nav";
import { NavItemLink } from "./NavItemLink";

// tiga tingkat: Laporan > Keuangan > Pajak
const item: NavItem = {
  to: "/app/laporan",
  label: "Laporan",
  icon: Layers,
  children: [
    { to: "/app/laporan/siswa", label: "Laporan Siswa" },
    { to: "/app/laporan/keuangan", label: "Keuangan", children: [{ to: "/app/laporan/keuangan/pajak", label: "Pajak" }] },
  ],
};

const Lokasi = () => <p data-testid="lokasi">{useLocation().pathname}</p>;

function renderItem(props: { collapsed: boolean; popover?: boolean }, path = "/app") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TooltipProvider>
        <NavItemLink item={item} tooltipSide="right" {...props} />
        <Lokasi />
      </TooltipProvider>
    </MemoryRouter>,
  );
}

describe("menu bersarang lebih dari satu tingkat", () => {
  it("sidebar terbuka: tiap tingkat dilipat sendiri-sendiri dan leaf terdalam bisa dibuka", async () => {
    const user = userEvent.setup();
    renderItem({ collapsed: false });
    expect(screen.queryByRole("link", { name: "Laporan Siswa" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Laporan" }));
    expect(screen.getByRole("link", { name: "Laporan Siswa" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Pajak" })).not.toBeInTheDocument();
    const keuangan = screen.getByRole("button", { name: "Keuangan" });
    expect(keuangan).toHaveAttribute("aria-expanded", "false");
    await user.click(keuangan);
    expect(keuangan).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("link", { name: "Pajak" }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/app/laporan/keuangan/pajak");
  });

  it("sidebar terbuka: grup yang memuat halaman aktif terbuka sejak awal di semua tingkat", () => {
    renderItem({ collapsed: false }, "/app/laporan/keuangan/pajak");
    expect(screen.getByRole("button", { name: "Laporan" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Keuangan" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Pajak" })).toHaveAttribute("aria-current", "page");
  });

  it.each([
    ["sidebar ciut", { collapsed: true }],
    ["header horizontal", { collapsed: false, popover: true }],
  ])("%s: popup memakai submenu bersarang yang bisa dibuka dengan keyboard", async (_nama, props) => {
    const user = userEvent.setup();
    renderItem(props);
    await user.click(screen.getByRole("button", { name: "Laporan" }));
    const keuangan = await screen.findByRole("menuitem", { name: "Keuangan" });
    expect(screen.getByRole("menuitem", { name: "Laporan Siswa" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Pajak" })).not.toBeInTheDocument();
    keuangan.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(await within(document.body).findByRole("menuitem", { name: "Pajak" }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/app/laporan/keuangan/pajak");
  });
});
