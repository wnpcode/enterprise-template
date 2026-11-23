import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Table, TableBody, TableCaption, TableCell, TableEmpty, TableFooter, TableHead, TableHeader, TableRow } from "./Table";

const sample = (
  <Table className="c-table">
    <TableCaption className="c-caption">Daftar siswa</TableCaption>
    <TableHeader className="c-header">
      <TableRow className="c-row">
        <TableHead className="c-head">Nama</TableHead>
        <TableHead>Kelas</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody className="c-body">
      <TableRow>
        <TableCell className="c-cell">Aisyah</TableCell>
        <TableCell>7A</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter className="c-footer">
      <TableRow>
        <TableCell colSpan={2}>1 siswa</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);

describe("Table", () => {
  it("renders table semantics", () => {
    render(sample);
    expect(screen.getByRole("table", { name: "Daftar siswa" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "Aisyah" })).toBeInTheDocument();
  });

  it("merges className on each part", () => {
    render(sample);
    expect(screen.getByRole("table")).toHaveClass("c-table", "w-full");
    expect(screen.getByText("Daftar siswa")).toHaveClass("c-caption");
    expect(screen.getByRole("columnheader", { name: "Nama" })).toHaveClass("c-head");
    expect(screen.getByRole("cell", { name: "Aisyah" })).toHaveClass("c-cell");
    expect(screen.getAllByRole("rowgroup")[0]).toHaveClass("c-header");
    expect(screen.getAllByRole("rowgroup")[1]).toHaveClass("c-body");
    expect(screen.getAllByRole("rowgroup")[2]).toHaveClass("c-footer");
    expect(screen.getAllByRole("row")[0]).toHaveClass("c-row");
  });

  it("TableEmpty spans columns and shows default text", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3} />
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("cell", { name: "Tidak ada data" })).toHaveAttribute("colspan", "3");
  });

  it("TableEmpty renders custom children", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={2}>Belum ada siswa</TableEmpty>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("cell", { name: "Belum ada siswa" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(sample);
    await expectNoA11yViolations(container);
  });
});
