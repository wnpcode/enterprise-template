import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles on click when uncontrolled and fires onChange", async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="Terms" onChange={onChange} />);
    const box = screen.getByRole("checkbox", { name: "Terms" });
    await userEvent.click(box);
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
    await userEvent.click(box);
    expect(box).not.toBeChecked();
  });

  it("respects controlled checked without parent update", async () => {
    render(<Checkbox aria-label="Terms" checked onChange={() => {}} />);
    const box = screen.getByRole("checkbox");
    await userEvent.click(box);
    expect(box).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="Terms" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets aria-invalid when invalid", () => {
    render(<Checkbox aria-label="Terms" invalid />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("is associated with a label via htmlFor", async () => {
    render(
      <>
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms</label>
      </>,
    );
    await userEvent.click(screen.getByText("Accept terms"));
    expect(screen.getByLabelText("Accept terms")).toBeChecked();
  });

  it("toggles with the Space key", async () => {
    render(<Checkbox aria-label="Terms" />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <>
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms</label>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
