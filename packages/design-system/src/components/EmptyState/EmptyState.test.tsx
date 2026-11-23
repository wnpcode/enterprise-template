import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title, description and action", () => {
    render(<EmptyState title="Belum ada siswa" description="Tambah siswa pertama." action={<Button>Tambah</Button>} />);
    expect(screen.getByText("Belum ada siswa")).toBeInTheDocument();
    expect(screen.getByText("Tambah siswa pertama.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tambah" })).toBeInTheDocument();
  });

  it("renders only the title when nothing else is given", () => {
    const { container } = render(<EmptyState title="Kosong" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<EmptyState title="Kosong" description="Tidak ada data." icon={<svg aria-hidden="true" />} />);
    await expectNoA11yViolations(container);
  });
});
