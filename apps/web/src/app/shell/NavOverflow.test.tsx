import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router";
import { TooltipProvider } from "@enterprise/design-system";
import { AUTH_STORAGE_KEY, AuthProvider } from "../../features/auth/AuthProvider";
import { BottomNav } from "./BottomNav";
import { Topbar } from "./Topbar";

// sembilan item tingkat atas; item ke-7 adalah grup tiga tingkat: Laporan > Keuangan > Pajak
vi.mock("./nav", async (importOriginal) => {
  const { Circle } = await import("lucide-react");
  const leaf = (n: number) => ({ to: `/app/m${n}`, label: `Menu ${n}`, icon: Circle });
  const items = [
    leaf(1),
    leaf(2),
    leaf(3),
    leaf(4),
    leaf(5),
    leaf(6),
    {
      to: "/app/laporan",
      label: "Laporan",
      icon: Circle,
      children: [{ to: "/app/laporan/keuangan", label: "Keuangan", children: [{ to: "/app/laporan/keuangan/pajak", label: "Pajak" }] }],
    },
    leaf(8),
    leaf(9),
  ];
  return { ...(await importOriginal<typeof import("./nav")>()), navItems: items, visibleNavItems: () => items };
});

const Lokasi = () => <p data-testid="lokasi">{useLocation().pathname}</p>;

function renderWith(ui: React.ReactNode) {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      refreshToken: "refresh.2.x",
      user: { id: 2, name: "Budi Guru", email: "guru@sekolah.id", roles: ["guru"] },
      companies: [{ id: 1, name: "SMA Harapan Bangsa" }],
      companyId: 1,
    }),
  );
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={["/app"]}>
        <AuthProvider>
          <TooltipProvider>
            {ui}
            <Lokasi />
          </TooltipProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("menu banyak", () => {
  beforeEach(() => localStorage.clear());

  it("header horizontal: lima item inline, sisanya di popup Lainnya dengan submenu bersarang", async () => {
    const user = userEvent.setup();
    renderWith(<Topbar collapsed={false} onToggleCollapsed={() => {}} showCollapse={false} inlineNav />);
    const nav = within(screen.getByRole("navigation", { name: "Navigasi utama" }));
    for (const n of [1, 2, 3, 4, 5]) expect(nav.getByRole("link", { name: `Menu ${n}` })).toBeInTheDocument();
    expect(nav.queryByRole("link", { name: "Menu 6" })).not.toBeInTheDocument();

    await user.click(nav.getByRole("button", { name: "Lainnya" }));
    expect(await screen.findByRole("menuitem", { name: "Menu 6" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Menu 9" })).toBeInTheDocument();
    const laporan = screen.getByRole("menuitem", { name: "Laporan" });
    laporan.focus();
    await user.keyboard("{ArrowRight}");
    const keuangan = await screen.findByRole("menuitem", { name: "Keuangan" });
    keuangan.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(await screen.findByRole("menuitem", { name: "Pajak" }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/app/laporan/keuangan/pajak");
  });

  it("bottom nav: empat item di bar, sisanya lewat tombol Menu yang memuat seluruh pohon", async () => {
    const user = userEvent.setup();
    renderWith(<BottomNav />);
    const bar = within(screen.getByRole("navigation", { name: "Navigasi utama" }));
    for (const n of [1, 2, 3, 4]) expect(bar.getByRole("link", { name: `Menu ${n}` })).toBeInTheDocument();
    expect(bar.queryByRole("link", { name: "Menu 5" })).not.toBeInTheDocument();

    await user.click(bar.getByRole("button", { name: "Menu" }));
    const sheet = within(await screen.findByRole("dialog", { name: "Semua menu" }));
    for (const n of [1, 5, 6, 8, 9]) expect(sheet.getByRole("link", { name: `Menu ${n}` })).toBeInTheDocument();
    await user.click(sheet.getByRole("button", { name: "Laporan" }));
    await user.click(sheet.getByRole("button", { name: "Keuangan" }));
    await user.click(sheet.getByRole("link", { name: "Pajak" }));
    expect(screen.getByTestId("lokasi")).toHaveTextContent("/app/laporan/keuangan/pajak");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
