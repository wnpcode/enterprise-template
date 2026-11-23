import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expectNoA11yViolations } from "../../test/axe";
import { createColumnHelper, DataTable, type RowSelectionState, type SortingState } from "./index";

type Siswa = { id: number; nama: string; kelas: string };
const data: Siswa[] = [
  { id: 1, nama: "Citra", kelas: "7B" },
  { id: 2, nama: "Aisyah", kelas: "7A" },
  { id: 3, nama: "Bagas", kelas: "8A" },
];
const col = createColumnHelper<Siswa>();
const columns = [col.accessor("nama", { header: "Nama" }), col.accessor("kelas", { header: "Kelas", enableSorting: false })];

const bodyRows = () => within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row");
const firstCells = () => bodyRows().map((r) => within(r).getAllByRole("cell")[0].textContent);

function Sortable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  return <DataTable columns={columns} data={data} sorting={sorting} onSortingChange={setSorting} />;
}

function Selectable() {
  const [sel, setSel] = useState<RowSelectionState>({});
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        enableRowSelection
        rowSelection={sel}
        onRowSelectionChange={setSel}
        getRowId={(r) => String(r.id)}
      />
      <output>{Object.keys(sel).join(",")}</output>
    </>
  );
}

describe("DataTable", () => {
  it("renders header and rows in data order", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByRole("columnheader", { name: /Nama/ })).toBeInTheDocument();
    expect(firstCells()).toEqual(["Citra", "Aisyah", "Bagas"]);
  });

  it("sorts on the client when a sortable header is clicked and exposes aria-sort", async () => {
    const user = userEvent.setup();
    render(<Sortable />);
    const btn = screen.getByRole("button", { name: "Urutkan menurut Nama" });
    expect(screen.getByRole("columnheader", { name: /Nama/ })).toHaveAttribute("aria-sort", "none");
    expect(screen.getByRole("columnheader", { name: "Kelas" })).not.toHaveAttribute("aria-sort");
    await user.click(btn);
    expect(firstCells()).toEqual(["Aisyah", "Bagas", "Citra"]);
    expect(screen.getByRole("columnheader", { name: /Nama/ })).toHaveAttribute("aria-sort", "ascending");
    await user.click(btn);
    expect(firstCells()).toEqual(["Citra", "Bagas", "Aisyah"]);
    expect(screen.getByRole("columnheader", { name: /Nama/ })).toHaveAttribute("aria-sort", "descending");
  });

  it("with manualSorting only reports the change without reordering", async () => {
    const onSortingChange = vi.fn();
    render(<DataTable columns={columns} data={data} sorting={[]} onSortingChange={onSortingChange} manualSorting />);
    await userEvent.click(screen.getByRole("button", { name: "Urutkan menurut Nama" }));
    expect(onSortingChange).toHaveBeenCalled();
    expect(firstCells()).toEqual(["Citra", "Aisyah", "Bagas"]);
  });

  it("selects rows individually and all at once", async () => {
    const user = userEvent.setup();
    render(<Selectable />);
    const rowBoxes = screen.getAllByRole("checkbox", { name: "Pilih baris" });
    await user.click(rowBoxes[1]);
    expect(screen.getByRole("status")).toHaveTextContent("2");
    expect(bodyRows()[1]).toHaveAttribute("data-state", "selected");
    const all = screen.getByRole("checkbox", { name: "Pilih semua baris" }) as HTMLInputElement;
    expect(all.indeterminate).toBe(true);
    await user.click(all);
    expect(screen.getByRole("status")).toHaveTextContent("1,2,3");
    await user.click(all);
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("shows skeleton rows while loading and an empty message without data", () => {
    const { rerender } = render(<DataTable columns={columns} data={[]} loading skeletonRows={3} />);
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByRole("table").closest("[aria-busy]")).toHaveAttribute("aria-busy", "true");
    rerender(<DataTable columns={columns} data={[]} empty="Belum ada siswa." />);
    expect(screen.getByRole("cell")).toHaveTextContent("Belum ada siswa.");
    expect(screen.getByRole("cell")).toHaveAttribute("colspan", "2");
  });

  it("renders pagination when page props are given", async () => {
    const onPageChange = vi.fn();
    render(<DataTable columns={columns} data={data} page={1} pageCount={3} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Halaman 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Selectable />);
    await expectNoA11yViolations(container);
  });
});
