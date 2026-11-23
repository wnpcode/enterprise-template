import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Label } from "../Label";
import { Combobox, type ComboboxProps } from "./Combobox";

const options = [
  { value: "7a", label: "Kelas 7A" },
  { value: "7b", label: "Kelas 7B" },
  { value: "8a", label: "Kelas 8A" },
];

function Example(props: Partial<ComboboxProps>) {
  return (
    <>
      <Label htmlFor="kelas">Kelas</Label>
      <Combobox id="kelas" options={options} {...props} />
    </>
  );
}

const open = () => userEvent.click(screen.getByRole("combobox", { name: "Kelas" }));

describe("Combobox", () => {
  it("is labelled by Label via htmlFor/id", () => {
    render(<Example />);
    expect(screen.getByRole("combobox", { name: "Kelas" })).toHaveTextContent("Pilih…");
  });

  it("opens on click and shows the search input", async () => {
    render(<Example />);
    await open();
    expect(await screen.findByPlaceholderText("Cari…")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("filters options while typing", async () => {
    render(<Example />);
    await open();
    await userEvent.type(await screen.findByPlaceholderText("Cari…"), "8A");
    expect(screen.getByRole("option", { name: /Kelas 8A/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Kelas 7A/ })).not.toBeInTheDocument();
  });

  it("selects the highlighted option with Enter", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await open();
    await userEvent.type(await screen.findByPlaceholderText("Cari…"), "7B{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("7b");
    expect(screen.getByRole("combobox", { name: "Kelas" })).toHaveTextContent("Kelas 7B");
  });

  it("selects an option on click and closes", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await open();
    await userEvent.click(await screen.findByRole("option", { name: /Kelas 8A/ }));
    expect(onValueChange).toHaveBeenCalledWith("8a");
    expect(screen.getByRole("combobox", { name: "Kelas" })).toHaveTextContent("Kelas 8A");
    expect(screen.queryByPlaceholderText("Cari…")).not.toBeInTheDocument();
  });

  it("shows empty text when nothing matches", async () => {
    render(<Example />);
    await open();
    await userEvent.type(await screen.findByPlaceholderText("Cari…"), "zzz");
    expect(await screen.findByText("Tidak ada hasil")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    render(<Example />);
    await open();
    await screen.findByPlaceholderText("Cari…");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByPlaceholderText("Cari…")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<Example disabled />);
    await open();
    expect(screen.queryByPlaceholderText("Cari…")).not.toBeInTheDocument();
  });

  it("sets aria-invalid when invalid", () => {
    render(<Example invalid />);
    expect(screen.getByRole("combobox", { name: "Kelas" })).toHaveAttribute("aria-invalid", "true");
  });

  it("shows the controlled value", () => {
    render(<Example value="7b" />);
    expect(screen.getByRole("combobox", { name: "Kelas" })).toHaveTextContent("Kelas 7B");
  });

  it("shows the defaultValue", () => {
    render(<Example defaultValue="8a" />);
    expect(screen.getByRole("combobox", { name: "Kelas" })).toHaveTextContent("Kelas 8A");
  });

  it("has no a11y violations closed", async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });

  it("has no a11y violations open", async () => {
    render(<Example />);
    await open();
    await screen.findByPlaceholderText("Cari…");
    await expectNoA11yViolations(await screen.findByRole("dialog"));
  });
});
