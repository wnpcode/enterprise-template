import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./Breadcrumb";

const sample = (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/app">Dashboard</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <button type="button">Siswa</button>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Aisyah Putri</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

describe("Breadcrumb", () => {
  it("renders a labelled nav with links and the current page", () => {
    render(sample);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/app");
    expect(screen.getByRole("link", { name: "Aisyah Putri" })).toHaveAttribute("aria-current", "page");
  });

  it("asChild merges classes into the child instead of rendering an anchor", () => {
    render(sample);
    const btn = screen.getByRole("button", { name: "Siswa" });
    expect(btn).toHaveClass("underline-offset-4");
    expect(btn.closest("a")).toBeNull();
  });

  it("hides separators from assistive tech", () => {
    const { container } = render(sample);
    const seps = container.querySelectorAll('li[aria-hidden="true"]');
    expect(seps).toHaveLength(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("has no a11y violations", async () => {
    const { container } = render(sample);
    await expectNoA11yViolations(container);
  });
});
