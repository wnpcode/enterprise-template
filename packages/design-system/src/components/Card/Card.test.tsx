import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../test/axe";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

describe("Card", () => {
  it("renders children in every part", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Judul</CardTitle>
          <CardDescription>Deskripsi</CardDescription>
        </CardHeader>
        <CardContent>Isi</CardContent>
        <CardFooter>Aksi</CardFooter>
      </Card>,
    );
    for (const text of ["Judul", "Deskripsi", "Isi", "Aksi"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("merges className on each part", () => {
    render(
      <Card className="c-card" data-testid="card">
        <CardHeader className="c-header">h</CardHeader>
        <CardTitle className="c-title">t</CardTitle>
        <CardDescription className="c-desc">d</CardDescription>
        <CardContent className="c-content">c</CardContent>
        <CardFooter className="c-footer">f</CardFooter>
      </Card>,
    );
    const pairs: [string, string][] = [
      ["h", "c-header"],
      ["t", "c-title"],
      ["d", "c-desc"],
      ["c", "c-content"],
      ["f", "c-footer"],
    ];
    expect(screen.getByTestId("card")).toHaveClass("c-card", "rounded-lg");
    for (const [text, cls] of pairs) expect(screen.getByText(text)).toHaveClass(cls);
  });

  it("renders CardTitle as a heading", () => {
    render(<CardTitle>Judul</CardTitle>);
    expect(screen.getByRole("heading", { name: "Judul" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Judul</CardTitle>
          <CardDescription>Deskripsi</CardDescription>
        </CardHeader>
        <CardContent>Isi</CardContent>
      </Card>,
    );
    await expectNoA11yViolations(container);
  });
});
