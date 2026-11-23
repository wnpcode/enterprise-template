import { render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogTitle } from "../components/Dialog";
import { Pagination } from "../components/Pagination";
import { Spinner } from "../components/Spinner";
import { TableEmpty } from "../components/Table";
import { LocaleProvider } from "./LocaleProvider";

describe("LocaleProvider", () => {
  it("components fall back to Indonesian defaults", () => {
    render(
      <>
        <Spinner />
        <Pagination page={1} pageCount={3} onPageChange={() => {}} />
      </>,
    );
    expect(screen.getByRole("status", { name: "Memuat" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigasi halaman" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Halaman 2" })).toBeInTheDocument();
  });

  it("overrides only the given strings, keeping the rest", () => {
    render(
      <LocaleProvider value={{ pagination: { page: (n) => `Page ${n}`, nav: "Pages" } }}>
        <Pagination page={1} pageCount={3} onPageChange={() => {}} />
        <table>
          <tbody>
            <TableEmpty colSpan={1} />
          </tbody>
        </table>
      </LocaleProvider>,
    );
    expect(screen.getByRole("navigation", { name: "Pages" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Halaman sebelumnya" })).toBeInTheDocument();
    expect(screen.getByText("Tidak ada data")).toBeInTheDocument();
  });

  it("changes the close label of overlays", () => {
    render(
      <LocaleProvider value={{ close: "Close" }}>
        <Dialog open>
          <DialogContent>
            <DialogTitle>Judul</DialogTitle>
          </DialogContent>
        </Dialog>
      </LocaleProvider>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});
