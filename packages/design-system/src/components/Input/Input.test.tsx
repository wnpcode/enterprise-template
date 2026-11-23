import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Label } from "../Label";
import { Input } from "./Input";

describe("Input", () => {
  it("is associated with a Label via htmlFor/id", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
  });

  it("updates value when typing (uncontrolled)", async () => {
    render(<Input aria-label="name" />);
    const input = screen.getByLabelText("name");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("fires onChange when controlled", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState("");
      return (
        <Input
          aria-label="name"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setValue(e.target.value);
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.type(screen.getByLabelText("name"), "ab");
    expect(onChange).toHaveBeenLastCalledWith("ab");
    expect(screen.getByLabelText("name")).toHaveValue("ab");
  });

  it("sets aria-invalid only when invalid", () => {
    const { rerender } = render(<Input aria-label="x" />);
    expect(screen.getByLabelText("x")).not.toHaveAttribute("aria-invalid");
    rerender(<Input aria-label="x" invalid />);
    expect(screen.getByLabelText("x")).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps a consumer-provided aria-invalid", () => {
    render(<Input aria-label="x" aria-invalid="true" />);
    expect(screen.getByLabelText("x")).toHaveAttribute("aria-invalid", "true");
  });

  it("passes aria-describedby through", () => {
    render(
      <>
        <Input aria-label="x" aria-describedby="err" />
        <p id="err">Wajib diisi</p>
      </>,
    );
    expect(screen.getByLabelText("x")).toHaveAccessibleDescription("Wajib diisi");
  });

  it("prevents typing when disabled", async () => {
    render(<Input aria-label="x" disabled />);
    const input = screen.getByLabelText("x");
    await userEvent.type(input, "abc");
    expect(input).toBeDisabled();
    expect(input).toHaveValue("");
  });

  it("applies size classes, md by default", () => {
    const { rerender } = render(<Input aria-label="x" />);
    expect(screen.getByLabelText("x")).toHaveClass("h-10");
    rerender(<Input aria-label="x" size="sm" />);
    expect(screen.getByLabelText("x")).toHaveClass("h-8");
    rerender(<Input aria-label="x" size="lg" />);
    expect(screen.getByLabelText("x")).toHaveClass("h-12");
  });

  it("passes type through", () => {
    render(<Input aria-label="x" type="password" />);
    expect(screen.getByLabelText("x")).toHaveAttribute("type", "password");
  });

  it("merges className", () => {
    render(<Input aria-label="x" className="extra" />);
    expect(screen.getByLabelText("x")).toHaveClass("extra", "rounded-md");
  });

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="x" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText("x"));
  });

  it("has no a11y violations with a label", async () => {
    const { container } = render(
      <>
        <Label htmlFor="a">Email</Label>
        <Input id="a" invalid aria-describedby="e" />
        <p id="e">Tidak valid</p>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
