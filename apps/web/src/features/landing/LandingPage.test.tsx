import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { LandingPage } from "./LandingPage";

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe("LandingPage", () => {
  it("merender hero, fitur, harga, testimoni, FAQ, kontak, dan meta SEO (GSAP tidak melempar di jsdom)", () => {
    renderLanding();
    expect(screen.getByRole("heading", { name: "Administrasi sekolah dalam satu portal" })).toBeInTheDocument();
    for (const nama of ["Dashboard", "Siswa", "Komponen", "Pengaturan"]) expect(screen.getByText(nama)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Harga" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Pertanyaan yang sering diajukan" })).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Kontak" })).toBeInTheDocument();
    expect(document.title).toContain("Portal Sekolah");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute("content", expect.stringContaining("Verifikasi"));
    expect(document.querySelector('meta[property="og:title"]')).toBeInTheDocument();
  });

  it("FAQ membuka satu jawaban lewat Accordion", async () => {
    renderLanding();
    const trigger = screen.getByRole("button", { name: /Apakah data sekolah/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Portal dapat dipasang di server sekolah/)).toBeVisible();
  });

  it("form kontak memvalidasi lalu mengirim ke API dan menampilkan konfirmasi", async () => {
    const user = userEvent.setup();
    renderLanding();
    const form = screen.getByRole("form", { name: "Kontak" });
    await user.click(within(form).getByRole("button", { name: "Kirim pesan" }));
    expect(await within(form).findByText("Pesan wajib diisi.")).toBeInTheDocument();
    await user.type(within(form).getByLabelText("Nama lengkap", { exact: false }), "Dewi");
    await user.type(within(form).getByLabelText("Email", { exact: false }), "dewi@sekolah.id");
    await user.type(within(form).getByLabelText("Nama sekolah", { exact: false }), "SMA Contoh");
    await user.type(within(form).getByLabelText("Pesan", { exact: false }), "Ingin demo.");
    await user.click(within(form).getByRole("button", { name: "Kirim pesan" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Pesan terkirim.");
    expect(within(form).getByLabelText("Nama lengkap", { exact: false })).toHaveValue("");
  });
});
