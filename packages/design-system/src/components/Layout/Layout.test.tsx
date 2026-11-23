import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Container, PageHeader, Stack } from "./Layout";

describe("Container", () => {
  it("defaults to max-w-6xl and renders children", () => {
    render(<Container data-testid="c">Isi</Container>);
    expect(screen.getByTestId("c")).toHaveClass("mx-auto", "w-full", "max-w-6xl");
    expect(screen.getByText("Isi")).toBeInTheDocument();
  });

  it("applies the sm size", () => {
    render(<Container size="sm" data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveClass("max-w-2xl");
    expect(screen.getByTestId("c")).not.toHaveClass("max-w-6xl");
  });

  it("merges className", () => {
    render(<Container className="extra" data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveClass("extra", "max-w-6xl");
  });
});

describe("Stack", () => {
  it("defaults to a column with gap-4", () => {
    render(<Stack data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("flex", "flex-col", "gap-4");
    expect(screen.getByTestId("s")).not.toHaveClass("flex-wrap");
  });

  it("applies row, gap, align, justify and wrap", () => {
    render(<Stack direction="row" gap={2} align="center" justify="between" wrap data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("flex-row", "gap-2", "items-center", "justify-between", "flex-wrap");
  });

  it("merges className", () => {
    render(<Stack className="extra" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("extra", "flex-col");
  });
});

describe("PageHeader", () => {
  it("renders the title as a level 1 heading", () => {
    render(<PageHeader title="Data Siswa" />);
    expect(screen.getByRole("heading", { level: 1, name: "Data Siswa" })).toBeInTheDocument();
  });

  it("renders description and actions when given", () => {
    render(<PageHeader title="Data Siswa" description="Daftar siswa aktif" actions={<button>Tambah</button>} />);
    expect(screen.getByText("Daftar siswa aktif")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tambah" })).toBeInTheDocument();
  });

  it("omits description and actions when absent", () => {
    const { container } = render(<PageHeader title="Data Siswa" />);
    expect(container.querySelector("p")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<PageHeader title="Data Siswa" description="Daftar siswa aktif" actions={<button>Tambah</button>} />);
    await expectNoA11yViolations(container);
  });
});
