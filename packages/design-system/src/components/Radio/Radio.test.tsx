import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("selects on click when uncontrolled and fires onChange", async () => {
    const onChange = vi.fn();
    render(<Radio aria-label="Terms" onChange={onChange} />);
    const box = screen.getByRole("radio", { name: "Terms" });
    await userEvent.click(box);
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("respects controlled checked without parent update", async () => {
    render(<Radio aria-label="Terms" checked onChange={() => {}} />);
    const box = screen.getByRole("radio");
    await userEvent.click(box);
    expect(box).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(<Radio aria-label="Terms" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("is associated with a label via htmlFor", async () => {
    render(
      <>
        <Radio id="terms" />
        <label htmlFor="terms">Accept terms</label>
      </>,
    );
    await userEvent.click(screen.getByText("Accept terms"));
    expect(screen.getByLabelText("Accept terms")).toBeChecked();
  });

  it("selects with the Space key", async () => {
    render(<Radio aria-label="Terms" />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("selects only one radio within a name group", async () => {
    render(
      <>
        <Radio name="plan" aria-label="Free" />
        <Radio name="plan" aria-label="Pro" />
      </>,
    );
    await userEvent.click(screen.getByLabelText("Free"));
    await userEvent.click(screen.getByLabelText("Pro"));
    expect(screen.getByLabelText("Free")).not.toBeChecked();
    expect(screen.getByLabelText("Pro")).toBeChecked();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <>
        <Radio id="terms" />
        <label htmlFor="terms">Accept terms</label>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
