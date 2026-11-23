import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Input } from "../Input";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("menghubungkan label ke kontrol lewat id", () => {
    render(<FormField label="Email">{(p) => <Input {...p} />}</FormField>);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
  });

  it("memakai id yang diberikan dan menyebarkan required", () => {
    render(
      <FormField id="e" label="Email" required>
        {(p) => <Input {...p} />}
      </FormField>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("id", "e");
    expect(input).toBeRequired();
  });

  it("hint dan error masuk aria-describedby, error memberi aria-invalid", () => {
    render(
      <FormField id="e" label="Email" hint="Pakai email sekolah." error="Format email tidak valid.">
        {(p) => <Input {...p} />}
      </FormField>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-describedby", "e-hint e-error");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Pakai email sekolah. Format email tidak valid.");
  });

  it("tanpa hint dan error tidak memasang aria-describedby maupun aria-invalid", () => {
    render(<FormField label="Email">{(p) => <Input {...p} />}</FormField>);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <FormField label="Email" required hint="Pakai email sekolah." error="Wajib diisi.">
        {(p) => <Input {...p} type="email" />}
      </FormField>,
    );
    await expectNoA11yViolations(container);
  });
});
