import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Pagination, getPaginationRange } from "./Pagination";

describe("getPaginationRange", () => {
  it.each([
    [1, 1, 1, [1]],
    [1, 0, 1, []],
    [1, 5, 1, [1, 2, 3, 4, 5]],
    [1, 7, 1, [1, 2, 3, 4, 5, 6, 7]],
    [1, 8, 1, [1, 2, "ellipsis", 8]],
    [3, 5, 1, [1, 2, 3, 4, 5]],
    [4, 10, 1, [1, 2, 3, 4, 5, "ellipsis", 10]],
    [5, 10, 1, [1, "ellipsis", 4, 5, 6, "ellipsis", 10]],
    [1, 10, 1, [1, 2, "ellipsis", 10]],
    [2, 10, 1, [1, 2, 3, "ellipsis", 10]],
    [10, 10, 1, [1, "ellipsis", 9, 10]],
    [5, 10, 2, [1, 2, 3, 4, 5, 6, 7, "ellipsis", 10]],
  ])("page %i of %i (sibling %i)", (page, count, sibling, expected) => {
    expect(getPaginationRange(page, count, sibling)).toEqual(expected);
  });
});

describe("Pagination", () => {
  it("renders nav with label and marks the current page", () => {
    render(<Pagination page={5} pageCount={10} onPageChange={() => {}} label="Daftar siswa" />);
    expect(screen.getByRole("navigation", { name: "Daftar siswa" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Halaman 5" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Halaman 4" })).not.toHaveAttribute("aria-current");
  });

  it("renders nothing when pageCount < 1", () => {
    render(<Pagination page={1} pageCount={0} onPageChange={() => {}} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("calls onPageChange with the clicked page", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Halaman 6" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("disables previous on first page and next on last page", () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Halaman sebelumnya" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Halaman berikutnya" })).toBeEnabled();
    rerender(<Pagination page={3} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Halaman berikutnya" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Halaman sebelumnya" })).toBeEnabled();
  });

  it("previous and next call with page -/+ 1", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Halaman sebelumnya" }));
    await userEvent.click(screen.getByRole("button", { name: "Halaman berikutnya" }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 4);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 6);
  });

  it("hides the ellipsis from assistive tech", () => {
    render(<Pagination page={5} pageCount={10} onPageChange={() => {}} />);
    const ellipses = screen.getAllByText("…");
    expect(ellipses).toHaveLength(2);
    for (const el of ellipses) expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Pagination page={5} pageCount={10} onPageChange={() => {}} />);
    await expectNoA11yViolations(container);
  });
});
