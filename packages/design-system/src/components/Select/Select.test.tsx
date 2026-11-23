import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Label } from "../Label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./Select";

function Example({
  onValueChange,
  disabled,
  invalid,
  name,
}: {
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
}) {
  return (
    <>
      <Label htmlFor="jenjang">Jenjang</Label>
      <Select onValueChange={onValueChange} name={name}>
        <SelectTrigger id="jenjang" disabled={disabled} invalid={invalid}>
          <SelectValue placeholder="Pilih jenjang" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Jenjang</SelectLabel>
            <SelectItem value="sd">SD</SelectItem>
            <SelectItem value="smp">SMP</SelectItem>
            <SelectSeparator />
            <SelectItem value="sma">SMA</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

describe("Select", () => {
  it("is labelled by Label via htmlFor/id", () => {
    render(<Example />);
    expect(screen.getByRole("combobox", { name: "Jenjang" })).toBeInTheDocument();
  });

  it("opens on click and lists options", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("combobox", { name: "Jenjang" }));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selects an option on click", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Jenjang" }));
    await userEvent.click(await screen.findByRole("option", { name: "SMP" }));
    expect(onValueChange).toHaveBeenCalledWith("smp");
    expect(screen.getByRole("combobox", { name: "Jenjang" })).toHaveTextContent("SMP");
  });

  it("selects with the keyboard", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    screen.getByRole("combobox", { name: "Jenjang" }).focus();
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("combobox", { name: "Jenjang" })).not.toHaveTextContent("Pilih jenjang");
  });

  it("does not open when disabled", async () => {
    render(<Example disabled />);
    const trigger = screen.getByRole("combobox", { name: "Jenjang" });
    await userEvent.click(trigger);
    expect(trigger).toBeDisabled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("sets aria-invalid when invalid", () => {
    render(<Example invalid />);
    expect(screen.getByRole("combobox", { name: "Jenjang" })).toHaveAttribute("aria-invalid", "true");
  });

  it("renders a hidden native select with name inside a form", () => {
    const { container } = render(
      <form>
        <Example name="level" />
      </form>,
    );
    expect(container.querySelector("select[name='level']")).toBeInTheDocument();
  });

  it("has no a11y violations closed", async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });

  it("has no a11y violations open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("combobox", { name: "Jenjang" }));
    await expectNoA11yViolations(await screen.findByRole("listbox"));
  });
});
