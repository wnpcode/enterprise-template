import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button";
import { Popover, PopoverContent, PopoverTrigger } from "./index";

function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Filter</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filter kelas">
        <label>
          Kelas
          <input type="text" />
        </label>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("is closed by default", () => {
    render(<Example />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens via trigger click", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    expect(await screen.findByRole("dialog", { name: "Filter kelas" })).toBeVisible();
  });

  it("closes on Escape", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves focus inside when open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("merges className and defaults", async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button>Filter</Button>
        </PopoverTrigger>
        <PopoverContent className="custom">x</PopoverContent>
      </Popover>,
    );
    expect(await screen.findByRole("dialog")).toHaveClass("custom", "w-72");
  });

  it("has no a11y violations while open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    const dialog = await screen.findByRole("dialog");
    await expectNoA11yViolations(dialog);
  });
});
