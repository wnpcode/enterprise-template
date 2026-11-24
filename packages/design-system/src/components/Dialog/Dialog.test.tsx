import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./index";

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus kelas?</DialogTitle>
          <DialogDescription>Tindakan ini tidak dapat dibatalkan.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button variant="danger">Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("is closed by default", () => {
    render(<Example />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens via trigger with title as accessible name", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog", { name: "Hapus kelas?" })).toBeInTheDocument();
    expect(screen.getByText("Tindakan ini tidak dapat dibatalkan.")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via the close button", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via DialogClose", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(await screen.findByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves focus inside on open and back to trigger on close", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("merges className on content", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="custom">
          <DialogTitle>T</DialogTitle>
          <DialogDescription>D</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(await screen.findByRole("dialog")).toHaveClass("custom", "max-w-lg");
  });

  it("has no a11y violations while open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    await expectNoA11yViolations(dialog);
  });

  it("tidak menutup saat pointer ditekan di dalam Tour, tetapi tetap menutup untuk klik di luar lainnya", async () => {
    render(
      <>
        <button>Luar</button>
        <div data-ds-tour="">Panel tur</div>
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Judul</DialogTitle>
            <span id="x" />
          </DialogContent>
        </Dialog>
      </>,
    );
    await screen.findByRole("dialog");
    await new Promise((r) => setTimeout(r, 20)); // Radix baru memasang listener di luar setelah satu tick
    fireEvent.pointerDown(screen.getByText("Panel tur"));
    expect(screen.getByRole("dialog")).toBeVisible();
    fireEvent.pointerDown(screen.getByText("Luar"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
