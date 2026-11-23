import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive tech", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveAttribute("aria-hidden", "true");
  });

  it("merges className", () => {
    render(<Skeleton data-testid="s" className="h-4 w-32" />);
    expect(screen.getByTestId("s")).toHaveClass("h-4", "w-32", "animate-pulse", "bg-muted");
  });

  it("spreads props", () => {
    render(<Skeleton data-testid="s" id="x" />);
    expect(screen.getByTestId("s")).toHaveAttribute("id", "x");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    await expectNoA11yViolations(container);
  });
});
