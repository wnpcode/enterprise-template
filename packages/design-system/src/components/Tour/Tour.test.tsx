import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "../Sheet";
import { expectNoA11yViolations } from "../../test/axe";
import { LocaleProvider } from "../../locale/LocaleProvider";
import { Tour, type TourStep } from "./index";

const steps: TourStep[] = [
  { target: '[data-tour="cari"]', title: "Cari siswa", content: "Ketik nama untuk menyaring daftar." },
  { target: '[data-tour="hilang"]', title: "Tidak ada", content: "Elemen ini tidak ada di halaman." },
  { target: '[data-tour="tambah"]', title: "Tambah siswa", content: "Buka form siswa baru." },
];

// jsdom tidak punya layout: semua elemen berukuran 0 dan dianggap tersembunyi
const visible = { width: 100, height: 30, top: 10, left: 10, right: 110, bottom: 40, x: 10, y: 10, toJSON: () => ({}) };
const mockRect = (el: HTMLElement | null) => {
  if (el) el.getBoundingClientRect = () => visible;
};
function Page({ onChange }: { onChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <input data-tour="cari" aria-label="Cari" ref={mockRect} />
      <button data-tour="tambah" ref={mockRect}>
        Tambah
      </button>
      <button onClick={() => setOpen(true)}>Ulangi</button>
      <Tour
        steps={steps}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onChange?.(next);
        }}
      />
    </>
  );
}

describe("Tour", () => {
  it("renders nothing while closed", () => {
    render(<Tour steps={steps} open={false} onOpenChange={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the first step with progress counting only reachable steps", async () => {
    render(<Page />);
    const dialog = await screen.findByRole("dialog", { name: "Cari siswa" });
    expect(dialog).toHaveTextContent("Langkah 1 dari 2");
    expect(screen.queryByRole("button", { name: "Sebelumnya" })).not.toBeInTheDocument();
  });

  it("skips a missing target and moves back and forth", async () => {
    render(<Page />);
    await screen.findByRole("dialog", { name: "Cari siswa" });
    await userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));
    expect(await screen.findByRole("dialog", { name: "Tambah siswa" })).toHaveTextContent("Langkah 2 dari 2");
    await userEvent.click(screen.getByRole("button", { name: "Sebelumnya" }));
    expect(await screen.findByRole("dialog", { name: "Cari siswa" })).toBeVisible();
  });

  it("closes from the last step with Selesai", async () => {
    const onChange = vi.fn();
    render(<Page onChange={onChange} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));
    await userEvent.click(await screen.findByRole("button", { name: "Selesai" }));
    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes with Lewati and with Escape, and restarts from step 1", async () => {
    const onChange = vi.fn();
    render(<Page onChange={onChange} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));
    await screen.findByRole("dialog", { name: "Tambah siswa" });
    await userEvent.keyboard("{Escape}");
    expect(onChange).toHaveBeenCalledWith(false);
    await userEvent.click(screen.getByRole("button", { name: "Ulangi" }));
    expect(await screen.findByRole("dialog", { name: "Cari siswa" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Lewati" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes right away when no target is visible", () => {
    const onChange = vi.fn();
    render(<Tour steps={steps} open onOpenChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("uses locale overrides", async () => {
    render(
      <LocaleProvider value={{ tour: { next: "Next", progress: (i, n) => `${i}/${n}` } }}>
        <Page />
      </LocaleProvider>,
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("1/2");
    expect(screen.getByRole("button", { name: "Next" })).toBeVisible();
  });

  it("has no a11y violations while open", async () => {
    render(<Page />);
    await expectNoA11yViolations(await screen.findByRole("dialog"));
  });

  describe("before", () => {
    // tombol di halaman + isian di dalam Sheet yang hanya ada setelah `before` membukanya
    function WithSheet({ onChange }: { onChange?: (open: boolean) => void }) {
      const [sheet, setSheet] = useState(false);
      const [tour, setTour] = useState(true);
      return (
        <>
          <button data-tour="tambah" ref={mockRect}>
            Tambah
          </button>
          <Sheet open={sheet} onOpenChange={setSheet}>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle>Form</SheetTitle>
              <input data-tour="nama" aria-label="Nama" ref={mockRect} />
            </SheetContent>
          </Sheet>
          <Tour
            open={tour}
            onOpenChange={(next) => {
              setTour(next);
              onChange?.(next);
            }}
            steps={[
              { target: '[data-tour="tambah"]', title: "Tombol tambah", content: "x", before: () => setSheet(false) },
              { target: '[data-tour="nama"]', title: "Isi nama", content: "x", before: () => setSheet(true) },
              { target: '[data-tour="tambah"]', title: "Kembali", content: "x", before: () => setSheet(false) },
            ]}
          />
        </>
      );
    }

    it("waits for a target that only exists after before() opens the Sheet", async () => {
      render(<WithSheet />);
      await screen.findByRole("dialog", { name: "Tombol tambah" });
      await userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));
      expect(await screen.findByRole("dialog", { name: "Isi nama" })).toHaveTextContent("Langkah 2 dari 3");
      expect(screen.getByRole("dialog", { name: "Form" })).toBeVisible();
    });

    it("keeps the Sheet open when the tour button is clicked, and closes it again via before()", async () => {
      render(<WithSheet />);
      await screen.findByRole("dialog", { name: "Tombol tambah" });
      await userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));
      await screen.findByRole("dialog", { name: "Isi nama" });
      await userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));
      expect(await screen.findByRole("dialog", { name: "Kembali" })).toBeVisible();
      await waitFor(() => expect(screen.queryByRole("dialog", { name: "Form" })).not.toBeInTheDocument());
    });

    it("moves focus to the primary button on every step so Enter keeps advancing", async () => {
      render(<WithSheet />);
      await screen.findByRole("dialog", { name: "Tombol tambah" });
      await waitFor(() => expect(screen.getByRole("button", { name: "Berikutnya" })).toHaveFocus());
      await userEvent.keyboard("{Enter}");
      await screen.findByRole("dialog", { name: "Isi nama" });
      await waitFor(() => expect(screen.getByRole("button", { name: "Berikutnya" })).toHaveFocus());
      await userEvent.keyboard("{Enter}");
      expect(await screen.findByRole("dialog", { name: "Kembali" })).toBeVisible();
    });

    it("skips a step whose target never appears, in the direction of travel", async () => {
      function Page() {
        const [open, setOpen] = useState(true);
        return (
          <>
            <button data-tour="a" ref={mockRect}>
              A
            </button>
            <button data-tour="c" ref={mockRect}>
              C
            </button>
            <Tour
              open={open}
              onOpenChange={setOpen}
              steps={[
                { target: '[data-tour="a"]', title: "Satu", content: "x" },
                { target: '[data-tour="b"]', title: "Dua", content: "x", before: () => {} },
                { target: '[data-tour="c"]', title: "Tiga", content: "x" },
              ]}
            />
          </>
        );
      }
      render(<Page />);
      await screen.findByRole("dialog", { name: "Satu" });
      await userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));
      // step "Dua" menunggu 2 detik lalu dilewati
      expect(await screen.findByRole("dialog", { name: "Tiga" }, { timeout: 4000 })).toHaveTextContent("Langkah 3 dari 3");
    }, 8000);
  });

  describe("group", () => {
    // tiga fitur: Cari (1 step), Tambah (3 step), Aksi (1 step)
    const grouped: TourStep[] = [
      { target: '[data-tour="a"]', group: "Cari", title: "Kolom cari", content: "x" },
      { target: '[data-tour="b"]', group: "Tambah", title: "Tombol tambah", content: "x" },
      { target: '[data-tour="c"]', group: "Tambah", title: "Isi nama", content: "x" },
      { target: '[data-tour="d"]', group: "Tambah", title: "Isi kelas", content: "x" },
      { target: '[data-tour="e"]', group: "Aksi", title: "Menu aksi", content: "x" },
    ];
    function Grouped({ onChange, locale }: { onChange?: (open: boolean) => void; locale?: ReactNode }) {
      const [open, setOpen] = useState(true);
      return (
        <>
          {["a", "b", "c", "d", "e"].map((k) => (
            <button key={k} data-tour={k} ref={mockRect}>
              {k}
            </button>
          ))}
          <Tour
            steps={grouped}
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              onChange?.(next);
            }}
          />
          {locale}
        </>
      );
    }
    const next = () => userEvent.click(screen.getByRole("button", { name: "Berikutnya" }));

    it("shows the feature label and counts steps inside the feature", async () => {
      render(<Grouped />);
      const first = await screen.findByRole("dialog", { name: "Kolom cari" });
      expect(first).toHaveTextContent("Cari");
      // fitur dengan satu step tidak menampilkan "Langkah 1 dari 1"
      expect(first).not.toHaveTextContent("Langkah");
      await next();
      await screen.findByRole("dialog", { name: "Tombol tambah" });
      await next();
      const third = await screen.findByRole("dialog", { name: "Isi nama" });
      expect(third).toHaveTextContent("Tambah");
      expect(third).toHaveTextContent("Langkah 2 dari 3");
    });

    it("draws one dot group per feature, hidden from assistive tech", async () => {
      render(<Grouped />);
      await screen.findByRole("dialog", { name: "Kolom cari" });
      const dots = document.querySelector("[data-tour-dots]")!;
      expect(dots).toHaveAttribute("aria-hidden", "true");
      expect(Array.from(dots.children).map((g) => g.children.length)).toEqual([1, 3, 1]);
    });

    it("skips a whole feature with Lewati fitur ini", async () => {
      render(<Grouped />);
      await screen.findByRole("dialog", { name: "Kolom cari" });
      await next();
      await screen.findByRole("dialog", { name: "Tombol tambah" });
      await userEvent.click(screen.getByRole("button", { name: "Lewati fitur ini" }));
      expect(await screen.findByRole("dialog", { name: "Menu aksi" })).toHaveTextContent("Aksi");
    });

    it("closes the whole tour when skipping the last feature, and with the close button", async () => {
      const onChange = vi.fn();
      const { unmount } = render(<Grouped onChange={onChange} />);
      await screen.findByRole("dialog", { name: "Kolom cari" });
      await userEvent.click(screen.getByRole("button", { name: "Tutup" }));
      expect(onChange).toHaveBeenCalledWith(false);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      unmount();

      const again = vi.fn();
      render(<Grouped onChange={again} />);
      await screen.findByRole("dialog", { name: "Kolom cari" });
      await next();
      await screen.findByRole("dialog", { name: "Tombol tambah" });
      await next();
      await screen.findByRole("dialog", { name: "Isi nama" });
      await next();
      await screen.findByRole("dialog", { name: "Isi kelas" });
      await next();
      // fitur terakhir: satu step, tidak ada Lewati; Selesai menutup
      await userEvent.click(await screen.findByRole("button", { name: "Selesai" }));
      expect(again).toHaveBeenCalledWith(false);
    });

    it("keeps the single-feature behavior: no close button, Lewati closes the tour", async () => {
      render(<Page />);
      await screen.findByRole("dialog", { name: "Cari siswa" });
      expect(screen.queryByRole("button", { name: "Tutup" })).not.toBeInTheDocument();
      expect(document.querySelector("[data-tour-dots]")).toBeNull();
      await userEvent.click(screen.getByRole("button", { name: "Lewati" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("uses the skipGroup locale override", async () => {
      render(
        <LocaleProvider value={{ tour: { skipGroup: "Skip feature" } }}>
          <Grouped />
        </LocaleProvider>,
      );
      await screen.findByRole("dialog", { name: "Kolom cari" });
      await next();
      await screen.findByRole("dialog", { name: "Tombol tambah" });
      expect(screen.getByRole("button", { name: "Skip feature" })).toBeVisible();
    });

    it("has no a11y violations with groups", async () => {
      render(<Grouped />);
      await expectNoA11yViolations(await screen.findByRole("dialog", { name: "Kolom cari" }));
    });
  });
});
