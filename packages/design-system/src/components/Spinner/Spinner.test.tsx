import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("exposes role status with default label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Memuat" })).toBeInTheDocument();
  });

  it("uses a custom label", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
  });

  it.each([
    ["sm", "size-4"],
    ["md", "size-5"],
    ["lg", "size-6"],
  ] as const)("applies %s size", (size, cls) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole("status")).toHaveClass(cls);
  });

  it("defaults to md and merges className", () => {
    render(<Spinner className="text-primary" />);
    expect(screen.getByRole("status")).toHaveClass("size-5", "text-primary");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Spinner />);
    await expectNoA11yViolations(container);
  });
});
