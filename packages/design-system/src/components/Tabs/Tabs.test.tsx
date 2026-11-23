import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

function Example({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue="profil" onValueChange={onValueChange}>
      <TabsList aria-label="Akun">
        <TabsTrigger value="profil">Profil</TabsTrigger>
        <TabsTrigger value="pengaturan">Pengaturan</TabsTrigger>
        <TabsTrigger value="riwayat" disabled>
          Riwayat
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profil">Data profil</TabsContent>
      <TabsContent value="pengaturan">Data pengaturan</TabsContent>
      <TabsContent value="riwayat">Data riwayat</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("selects the defaultValue tab and shows its panel", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "Profil" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Data profil");
  });

  it("switches panel on click and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Pengaturan" }));
    expect(screen.getByRole("tab", { name: "Pengaturan" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Data pengaturan");
    expect(onValueChange).toHaveBeenCalledWith("pengaturan");
  });

  it("moves selection with ArrowRight", async () => {
    render(<Example />);
    screen.getByRole("tab", { name: "Profil" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Pengaturan" })).toHaveAttribute("aria-selected", "true");
  });

  it("does not select a disabled tab", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Riwayat" }));
    expect(screen.getByRole("tab", { name: "Riwayat" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Data profil");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });
});
