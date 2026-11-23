import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./DropdownMenu";

function Example({ onEdit, onCheckedChange }: { onEdit?: () => void; onCheckedChange?: (c: boolean) => void }) {
  const [checked, setChecked] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Aksi</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Baris</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onEdit}>Ubah</DropdownMenuItem>
        <DropdownMenuItem destructive>Hapus</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={checked}
          onCheckedChange={(c) => {
            setChecked(c);
            onCheckedChange?.(c);
          }}
        >
          Tampilkan arsip
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const openMenu = () => userEvent.click(screen.getByRole("button", { name: "Aksi" }));

describe("DropdownMenu", () => {
  it("opens on click and lists menu items", async () => {
    render(<Example />);
    await openMenu();
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    expect(screen.getByRole("menuitemcheckbox", { name: "Tampilkan arsip" })).toBeInTheDocument();
  });

  it("calls onSelect on click and closes", async () => {
    const onEdit = vi.fn();
    render(<Example onEdit={onEdit} />);
    await openMenu();
    await userEvent.click(await screen.findByRole("menuitem", { name: "Ubah" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("selects with Enter and closes", async () => {
    const onEdit = vi.fn();
    render(<Example onEdit={onEdit} />);
    screen.getByRole("button", { name: "Aksi" }).focus();
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("menu");
    await userEvent.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles the checkbox item", async () => {
    const onCheckedChange = vi.fn();
    render(<Example onCheckedChange={onCheckedChange} />);
    await openMenu();
    const item = await screen.findByRole("menuitemcheckbox", { name: "Tampilkan arsip" });
    expect(item).toHaveAttribute("aria-checked", "false");
    await userEvent.click(item);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await openMenu();
    expect(await screen.findByRole("menuitemcheckbox", { name: "Tampilkan arsip" })).toHaveAttribute("aria-checked", "true");
  });

  it("closes on Escape", async () => {
    render(<Example />);
    await openMenu();
    await screen.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("styles destructive items", async () => {
    render(<Example />);
    await openMenu();
    expect(await screen.findByRole("menuitem", { name: "Hapus" })).toHaveClass("text-danger");
    expect(screen.getByRole("menuitem", { name: "Ubah" })).not.toHaveClass("text-danger");
  });

  it("has no a11y violations while open", async () => {
    render(<Example />);
    await openMenu();
    await expectNoA11yViolations(await screen.findByRole("menu"));
  });

  it("opens a submenu with ArrowRight, closes it with ArrowLeft, and selects an item inside it", async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Aksi</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Laporan</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={onSelect}>Keuangan</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await openMenu();
    const trigger = await screen.findByRole("menuitem", { name: "Laporan" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(screen.queryByRole("menuitem", { name: "Keuangan" })).not.toBeInTheDocument();
    trigger.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(await screen.findByRole("menuitem", { name: "Keuangan" })).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.queryByRole("menuitem", { name: "Keuangan" })).not.toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Laporan" })).toBeInTheDocument();

    await userEvent.keyboard("{ArrowRight}");
    await userEvent.click(await screen.findByRole("menuitem", { name: "Keuangan" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
