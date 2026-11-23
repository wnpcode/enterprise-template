import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { expectNoA11yViolations } from "../../test/axe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";

function Example(props: ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="a">
        <AccordionTrigger>Kapan PPDB dibuka?</AccordionTrigger>
        <AccordionContent>Mulai 1 Desember.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Apa saja syaratnya?</AccordionTrigger>
        <AccordionContent>Akta lahir dan KK.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
  it("opens and collapses an item (single collapsible)", async () => {
    render(<Example type="single" collapsible />);
    expect(trigger("Kapan PPDB dibuka?")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();

    await userEvent.click(trigger("Kapan PPDB dibuka?"));
    expect(trigger("Kapan PPDB dibuka?")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region")).toHaveTextContent("Mulai 1 Desember.");

    await userEvent.click(trigger("Kapan PPDB dibuka?"));
    expect(trigger("Kapan PPDB dibuka?")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("closes the first item when another opens (single)", async () => {
    render(<Example type="single" collapsible />);
    await userEvent.click(trigger("Kapan PPDB dibuka?"));
    await userEvent.click(trigger("Apa saja syaratnya?"));
    expect(trigger("Kapan PPDB dibuka?")).toHaveAttribute("aria-expanded", "false");
    expect(trigger("Apa saja syaratnya?")).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps both items open (multiple)", async () => {
    render(<Example type="multiple" />);
    await userEvent.click(trigger("Kapan PPDB dibuka?"));
    await userEvent.click(trigger("Apa saja syaratnya?"));
    expect(trigger("Kapan PPDB dibuka?")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Apa saja syaratnya?")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("region")).toHaveLength(2);
  });

  it("toggles with Enter", async () => {
    render(<Example type="single" collapsible />);
    trigger("Kapan PPDB dibuka?").focus();
    await userEvent.keyboard("{Enter}");
    expect(trigger("Kapan PPDB dibuka?")).toHaveAttribute("aria-expanded", "true");
  });

  it("opens the defaultValue item", () => {
    render(<Example type="single" defaultValue="b" />);
    expect(trigger("Apa saja syaratnya?")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region")).toHaveTextContent("Akta lahir dan KK.");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Example type="single" collapsible defaultValue="a" />);
    await expectNoA11yViolations(container);
  });
});
