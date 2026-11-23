import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider, TooltipProvider } from "@wnp_code/design-system";
import { http, HttpResponse } from "msw";
import { apiUrl } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { SiswaPage } from "./SiswaPage";
import { siswaContoh } from "./contoh";

function renderPage(url = "/app/siswa") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>
        <TooltipProvider>
          <ToastProvider>
            <SiswaPage />
          </ToastProvider>
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const dataRows = () => within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row");

describe("SiswaPage", () => {
  it("menampilkan skeleton lalu 5 baris siswa dari API", async () => {
    const { container } = renderPage();
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(await screen.findByText(siswaContoh[0].nama)).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
    expect(dataRows()).toHaveLength(5);
  });

  it("menampilkan pesan kosong saat pencarian tidak cocok", async () => {
    renderPage();
    await screen.findByText(siswaContoh[0].nama);
    await userEvent.type(screen.getByRole("searchbox", { name: "Cari nama siswa" }), "zzz");
    expect(await screen.findByText(/Tidak ada siswa bernama/)).toBeInTheDocument();
  });

  it("mengurutkan lewat header dengan mengirim sort ke server", async () => {
    renderPage();
    await screen.findByText(siswaContoh[0].nama);
    await userEvent.click(screen.getByRole("button", { name: "Urutkan menurut Nama" }));
    await userEvent.click(screen.getByRole("button", { name: "Urutkan menurut Nama" }));
    const terakhir = [...siswaContoh].sort((a, b) => b.nama.localeCompare(a.nama))[0].nama;
    expect(await within(dataRows()[0]).findByText(terakhir)).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Nama/ })).toHaveAttribute("aria-sort", "descending");
  });

  it("menambah siswa lewat Sheet lalu menampilkan toast dan baris baru", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText(siswaContoh[0].nama);
    await user.click(screen.getByRole("button", { name: "Tambah siswa" }));
    const dialog = screen.getByRole("dialog", { name: "Tambah siswa" });
    await user.click(within(dialog).getByRole("button", { name: "Simpan" }));
    expect(await within(dialog).findByText("Nama wajib diisi.")).toBeInTheDocument();
    await user.type(within(dialog).getByLabelText("Nama lengkap", { exact: false }), "Zahra Baru");
    await user.type(within(dialog).getByLabelText("Kelas", { exact: false }), "X IPA 3");
    await user.click(within(dialog).getByRole("button", { name: "Simpan" }));
    expect(await screen.findByText("Siswa ditambahkan")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(await within(dataRows()[0]).findByText("Zahra Baru")).toBeInTheDocument();
  });

  it("mengubah siswa lewat menu baris lalu memperbarui baris dan menampilkan toast", async () => {
    const user = userEvent.setup();
    renderPage();
    const { nama } = siswaContoh[0];
    await screen.findByText(nama);
    await user.click(screen.getByRole("button", { name: `Aksi untuk ${nama}` }));
    await user.click(await screen.findByRole("menuitem", { name: "Ubah siswa" }));
    const dialog = await screen.findByRole("dialog", { name: "Ubah siswa" });
    const input = within(dialog).getByLabelText("Nama lengkap", { exact: false });
    expect(input).toHaveValue(nama);
    await user.clear(input);
    await user.type(input, "Nama Diubah");
    await user.click(within(dialog).getByRole("button", { name: "Simpan" }));
    expect(await screen.findByText("Data siswa diperbarui")).toBeInTheDocument();
    expect(await within(dataRows()[0]).findByText("Nama Diubah")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("menghapus siswa setelah konfirmasi, dan batal tidak menghapus", async () => {
    const user = userEvent.setup();
    renderPage();
    const { nama } = siswaContoh[0];
    await screen.findByText(nama);

    await user.click(screen.getByRole("button", { name: `Aksi untuk ${nama}` }));
    await user.click(await screen.findByRole("menuitem", { name: "Hapus" }));
    let dialog = await screen.findByRole("dialog", { name: "Hapus siswa?" });
    await user.click(within(dialog).getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText(nama)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: `Aksi untuk ${nama}` }));
    await user.click(await screen.findByRole("menuitem", { name: "Hapus" }));
    dialog = await screen.findByRole("dialog", { name: "Hapus siswa?" });
    await user.click(within(dialog).getByRole("button", { name: "Hapus" }));
    expect(await screen.findByText("Siswa dihapus")).toBeInTheDocument();
    // toast ikut memuat nama, jadi periksa tabelnya saja
    await waitFor(() => expect(within(screen.getByRole("table")).queryByText(nama)).toBeNull());
  });

  it("memulihkan pencarian dan halaman dari URL", async () => {
    renderPage("/app/siswa?q=a&page=2");
    expect(screen.getByRole("searchbox", { name: "Cari nama siswa" })).toHaveValue("a");
    expect(await screen.findByRole("button", { name: /2/, current: "page" })).toBeInTheDocument();
  });

  it("menampilkan error lalu memuat ulang lewat Coba lagi", async () => {
    server.use(http.get(apiUrl("/siswa"), () => new HttpResponse(null, { status: 500 }), { once: true }));
    renderPage();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Coba lagi" }));
    expect(await screen.findByText(siswaContoh[0].nama)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
