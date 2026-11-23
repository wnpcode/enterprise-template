import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { ToastProvider, TooltipProvider } from "@wnpcode/design-system";
import { KomponenDetailPage } from "./KomponenDetailPage";
import { demos } from "./demos";

const EXPECTED = [
  "button",
  "input",
  "textarea",
  "label",
  "form-field",
  "badge",
  "alert",
  "avatar",
  "checkbox",
  "radio",
  "switch",
  "spinner",
  "skeleton",
  "card",
  "dialog",
  "sheet",
  "select",
  "combobox",
  "dropdown-menu",
  "tabs",
  "accordion",
  "tooltip",
  "popover",
  "toast",
  "pagination",
  "table",
  "data-table",
  "empty-state",
  "breadcrumb",
  "layout",
];

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TooltipProvider>
        <ToastProvider>
          <Routes>
            <Route path="/app/komponen/:slug" element={<KomponenDetailPage />} />
          </Routes>
        </ToastProvider>
      </TooltipProvider>
    </MemoryRouter>,
  );
}

describe("registry demo komponen", () => {
  it("memuat semua komponen dengan slug unik", () => {
    const slugs = demos.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.sort()).toEqual([...EXPECTED].sort());
  });

  it.each(demos.map((d) => [d.slug]))("demo %s dirender dengan judul dan minimal satu bagian", (slug) => {
    const { unmount } = renderAt(`/app/komponen/${slug}`);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0);
    unmount();
  });

  it("slug tidak dikenal menampilkan halaman tidak ditemukan", () => {
    renderAt("/app/komponen/tidak-ada");
    expect(screen.getByRole("heading", { level: 1, name: "Halaman tidak ditemukan" })).toBeInTheDocument();
  });
});
