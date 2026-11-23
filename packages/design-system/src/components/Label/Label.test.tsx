import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Label } from "./Label";

describe("Label", () => {
  it("renders its text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("marks required visually with an aria-hidden asterisk excluded from the accessible name", () => {
    render(
      <>
        <Label htmlFor="e" required>
          Email
        </Label>
        <input id="e" required />
      </>,
    );
    const asterisk = screen.getByText("*");
    expect(asterisk).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
  });

  it("shows no asterisk when not required", () => {
    render(<Label>Email</Label>);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("associates with an input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    );
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "n");
  });

  it("merges className", () => {
    render(<Label className="extra">Email</Label>);
    expect(screen.getByText("Email")).toHaveClass("extra", "text-sm");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <>
        <Label htmlFor="a" required>
          Email
        </Label>
        <input id="a" required />
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
