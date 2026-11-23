import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./Sheet";

function sample(side?: "right" | "left" | "bottom") {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Tambah siswa</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Tambah siswa</SheetTitle>
          <SheetDescription>Isi data lalu simpan.</SheetDescription>
        </SheetHeader>
        <input aria-label="Nama" />
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Batal</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("opens as a modal dialog from the trigger and closes with Escape", async () => {
    const user = userEvent.setup();
    render(sample());
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Tambah siswa" }));
    const dialog = screen.getByRole("dialog", { name: "Tambah siswa" });
    expect(dialog).toHaveAccessibleDescription("Isi data lalu simpan.");
    expect(dialog).toHaveClass("right-0");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes from SheetClose and the X button", async () => {
    const user = userEvent.setup();
    render(sample("bottom"));
    await user.click(screen.getByRole("button", { name: "Tambah siswa" }));
    expect(screen.getByRole("dialog")).toHaveClass("bottom-0");
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Tambah siswa" }));
    await user.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has no a11y violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(sample("left"));
    await user.click(screen.getByRole("button", { name: "Tambah siswa" }));
    await expectNoA11yViolations(baseElement);
  });
});
