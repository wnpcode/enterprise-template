import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("has role switch and reflects defaultChecked", () => {
    render(<Switch aria-label="Notifikasi" defaultChecked />);
    expect(screen.getByRole("switch", { name: "Notifikasi" })).toHaveAttribute("aria-checked", "true");
  });

  it("toggles on click when uncontrolled", async () => {
    render(<Switch aria-label="Notifikasi" />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange with the next value and still calls onClick", async () => {
    const onCheckedChange = vi.fn();
    const onClick = vi.fn();
    render(<Switch aria-label="Notifikasi" onCheckedChange={onCheckedChange} onClick={onClick} />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not change on its own when controlled", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Notifikasi" checked={false} onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("follows the parent when controlled", async () => {
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Switch aria-label="Notifikasi" checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles with Space and Enter", async () => {
    render(<Switch aria-label="Notifikasi" />);
    const sw = screen.getByRole("switch");
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(sw).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Enter}");
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Notifikasi" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("sets aria-invalid when invalid", () => {
    render(<Switch aria-label="Notifikasi" invalid />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Switch aria-label="Notifikasi" />);
    await expectNoA11yViolations(container);
  });
});
