import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Avatar, initials } from "./Avatar";

describe("Avatar", () => {
  it("computes initials from the first two words", () => {
    expect(initials("Budi Guru")).toBe("BG");
    expect(initials("  siti  ")).toBe("S");
    expect(initials("Rina Admin Sekolah")).toBe("RA");
    expect(initials("")).toBe("");
  });

  it("shows initials as an img fallback labelled by name when there is no src", () => {
    render(<Avatar name="Budi Guru" />);
    expect(screen.getByRole("img", { name: "Budi Guru" })).toHaveTextContent("BG");
  });

  it("is hidden from assistive tech when alt is empty", () => {
    render(<Avatar name="Budi Guru" alt="" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("BG")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies size variants and className", () => {
    const { container } = render(<Avatar name="A" size="lg" className="extra" />);
    expect(container.firstChild).toHaveClass("size-14", "extra");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Avatar name="Budi Guru" />);
    await expectNoA11yViolations(container);
  });
});
