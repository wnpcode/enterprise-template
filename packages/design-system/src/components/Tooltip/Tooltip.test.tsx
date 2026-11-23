import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./index";

function Example() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Simpan</Button>
        </TooltipTrigger>
        <TooltipContent>Simpan perubahan</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("is hidden by default", () => {
    render(<Example />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on keyboard focus", async () => {
    render(<Example />);
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Simpan perubahan");
  });

  it("hides on Escape", async () => {
    render(<Example />);
    await userEvent.tab();
    await screen.findByRole("tooltip");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("applies default styling and merges className", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button>Simpan</Button>
          </TooltipTrigger>
          <TooltipContent className="custom">Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await screen.findByRole("tooltip");
    expect(screen.getAllByText("Info")[0]).toHaveClass("custom", "bg-foreground");
  });

  it("has no a11y violations while open", async () => {
    const { container } = render(<Example />);
    await userEvent.tab();
    await screen.findByRole("tooltip");
    await expectNoA11yViolations(container);
  });
});
