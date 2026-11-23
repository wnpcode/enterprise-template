import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button";
import { ToastProvider, useToast } from "./index";
import type { ToastOptions } from "./index";

function Trigger({ options, label = "Notify" }: { options: ToastOptions; label?: string }) {
  const { toast } = useToast();
  return <Button onClick={() => toast(options)}>{label}</Button>;
}

function setup(options: ToastOptions) {
  return render(
    <ToastProvider>
      <Trigger options={options} />
    </ToastProvider>,
  );
}

describe("Toast", () => {
  it("renders the title and announces it", async () => {
    setup({ title: "Tersimpan" });
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(await screen.findByRole("listitem")).toHaveTextContent("Tersimpan");
    // Radix mirrors the content into a live-region role="status" for screen readers.
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Tersimpan"));
  });

  it("shows the description", async () => {
    setup({ title: "Tersimpan", description: "Data kelas diperbarui" });
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(await screen.findByText("Data kelas diperbarui")).toBeInTheDocument();
  });

  it("removes the toast with the close button", async () => {
    setup({ title: "Tersimpan" });
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    await screen.findByRole("listitem");
    await userEvent.click(screen.getByRole("button", { name: "Tutup" }));
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it.each([
    ["default", "bg-surface-elevated"],
    ["success", "bg-success-subtle"],
    ["danger", "bg-danger-subtle"],
  ] as const)("applies %s variant", async (variant, cls) => {
    setup({ title: "Info", variant });
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(await screen.findByRole("listitem")).toHaveClass(cls);
  });

  it("stacks multiple toasts", async () => {
    setup({ title: "Pesan" });
    const button = screen.getByRole("button", { name: "Notify" });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(await screen.findAllByRole("listitem")).toHaveLength(2);
  });

  it("dismiss removes a toast by id", async () => {
    function Example() {
      const { toast, dismiss } = useToast();
      return <Button onClick={() => dismiss(toast({ title: "Sementara" }))}>Go</Button>;
    }
    render(
      <ToastProvider>
        <Example />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("useToast throws outside ToastProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Trigger options={{ title: "x" }} />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it("has no a11y violations with a toast open", async () => {
    const { container } = setup({ title: "Tersimpan", description: "Data kelas diperbarui" });
    await userEvent.click(screen.getByRole("button", { name: "Notify" }));
    await screen.findByRole("listitem");
    await expectNoA11yViolations(container);
  });
});
