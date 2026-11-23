import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("defaults to info and role status", () => {
    render(<Alert>Pesan</Alert>);
    expect(screen.getByRole("status")).toHaveClass("bg-info-subtle");
  });

  it.each([
    ["info", "bg-info-subtle"],
    ["success", "bg-success-subtle"],
    ["warning", "bg-warning-subtle"],
    ["danger", "bg-danger-subtle"],
  ] as const)("renders %s variant", (variant, cls) => {
    render(<Alert variant={variant}>Pesan</Alert>);
    expect(screen.getByRole("status")).toHaveClass(cls);
  });

  it("uses role alert when live", () => {
    render(
      <Alert live title="Gagal">
        Coba lagi.
      </Alert>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Gagal");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Alert variant="warning" title="Perhatian">
        Kuota hampir habis.
      </Alert>,
    );
    await expectNoA11yViolations(container);
  });
});
