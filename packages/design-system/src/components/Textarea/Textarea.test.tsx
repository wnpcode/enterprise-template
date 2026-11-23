import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Label } from "../Label";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("is associated with a Label via htmlFor/id", () => {
    render(
      <>
        <Label htmlFor="msg">Pesan</Label>
        <Textarea id="msg" />
      </>,
    );
    expect(screen.getByLabelText("Pesan")).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("updates value when typing and fires onChange", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="x" onChange={onChange} />);
    const el = screen.getByLabelText("x");
    await userEvent.type(el, "hi");
    expect(el).toHaveValue("hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("sets aria-invalid only when invalid", () => {
    const { rerender } = render(<Textarea aria-label="x" />);
    expect(screen.getByLabelText("x")).not.toHaveAttribute("aria-invalid");
    rerender(<Textarea aria-label="x" invalid />);
    expect(screen.getByLabelText("x")).toHaveAttribute("aria-invalid", "true");
  });

  it("passes aria-describedby through", () => {
    render(
      <>
        <Textarea aria-label="x" aria-describedby="err" />
        <p id="err">Wajib diisi</p>
      </>,
    );
    expect(screen.getByLabelText("x")).toHaveAccessibleDescription("Wajib diisi");
  });

  it("prevents typing when disabled", async () => {
    render(<Textarea aria-label="x" disabled />);
    const el = screen.getByLabelText("x");
    await userEvent.type(el, "abc");
    expect(el).toHaveValue("");
  });

  it("merges className", () => {
    render(<Textarea aria-label="x" className="extra" />);
    expect(screen.getByLabelText("x")).toHaveClass("extra", "min-h-20");
  });

  it("forwards ref to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="x" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText("x"));
  });

  it("has no a11y violations with a label", async () => {
    const { container } = render(
      <>
        <Label htmlFor="a">Pesan</Label>
        <Textarea id="a" />
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
