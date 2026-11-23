import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider, TooltipProvider } from "@wnpcode/design-system";
import { siswaContoh } from "../siswa";
import { DashboardPage } from "./DashboardPage";

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/app"]}>
        <TooltipProvider>
          <ToastProvider>
            <DashboardPage />
          </ToastProvider>
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const statValue = (label: string) =>
  within(screen.getByText(label, { selector: "dt" }).parentElement as HTMLElement).getAllByText(/^\d+$/)[0];
const count = (status: string) => siswaContoh.filter((s) => s.status === status).length;

// mock PATCH memutasi siswaContoh bersama; kembalikan agar test lain tidak terpengaruh
const statusAwal = siswaContoh.map((s) => s.status);
afterEach(() => siswaContoh.forEach((s, i) => (s.status = statusAwal[i])));

describe("DashboardPage", () => {
  it("menampilkan 4 stat sesuai data dan keempat section", async () => {
    renderPage();
    expect(await screen.findByText("Total siswa")).toBeInTheDocument();
    expect(statValue("Total siswa")).toHaveTextContent(String(siswaContoh.length));
    expect(statValue("Siswa aktif")).toHaveTextContent(String(count("Aktif")));
    expect(statValue("Menunggu verifikasi")).toHaveTextContent(String(count("Menunggu")));
    expect(statValue("Ditolak")).toHaveTextContent(String(count("Ditolak")));
    expect(screen.getByText("Siswa per kelas")).toBeInTheDocument();
    expect(screen.getByText("Komposisi status")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pendaftaran terbaru" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Komponen yang tersedia" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lihat demo Button" })).toHaveAttribute("href", "/app/komponen/button");
  });

  it("menyetujui siswa dari menu aksi: toast muncul dan stat diperbarui", async () => {
    const user = userEvent.setup();
    renderPage();
    const menunggu = siswaContoh.find((s) => s.status === "Menunggu")!;
    await user.click(await screen.findByRole("button", { name: `Tinjau ${menunggu.nama}` }));
    await user.click(await screen.findByRole("menuitem", { name: "Setujui" }));
    expect(await screen.findByText("Siswa disetujui")).toBeInTheDocument();
    await waitFor(() => expect(statValue("Menunggu verifikasi")).toHaveTextContent(String(count("Menunggu"))));
    expect(menunggu.status).toBe("Aktif");
  });
});
