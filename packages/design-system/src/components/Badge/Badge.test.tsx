import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("defaults to neutral", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toHaveClass("bg-muted", "text-muted-foreground");
  });

  it.each([
    ["neutral", "bg-muted"],
    ["primary", "bg-primary"],
    ["success", "bg-success-subtle"],
    ["warning", "bg-warning-subtle"],
    ["danger", "bg-danger-subtle"],
    ["info", "bg-info-subtle"],
  ] as const)("renders %s variant", (variant, cls) => {
    render(<Badge variant={variant}>Label</Badge>);
    expect(screen.getByText("Label")).toHaveClass(cls);
  });

  it("merges className and spreads props", () => {
    render(
      <Badge className="extra" data-testid="b">
        Label
      </Badge>,
    );
    expect(screen.getByTestId("b")).toHaveClass("extra", "rounded-full");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    await expectNoA11yViolations(container);
  });
});
