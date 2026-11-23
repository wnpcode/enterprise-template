import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { TooltipProvider } from "@enterprise/design-system";
import { z } from "zod";
import { AuthProvider } from "../features/auth";
import { Sidebar } from "./shell/Sidebar";
import i18n, { LANG_STORAGE_KEY } from "./i18n";

function renderSidebar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TooltipProvider>
          <Sidebar collapsed={false} />
        </TooltipProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("i18n", () => {
  afterEach(async () => {
    await i18n.changeLanguage("id");
    localStorage.clear();
  });

  it("defaults to Indonesian and sets the document lang", () => {
    expect(i18n.language).toBe("id");
    expect(document.documentElement.lang).toBe("id");
    renderSidebar();
    expect(screen.getByRole("link", { name: "Siswa" })).toBeInTheDocument();
  });

  it("switching to English re-renders, persists, and changes zod messages", async () => {
    renderSidebar();
    await i18n.changeLanguage("en");
    expect(screen.getByRole("link", { name: "Students" })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe("en");
    expect(z.string().min(3).safeParse("a").error?.issues[0].message).toMatch(/Too small/);
    await i18n.changeLanguage("id");
    expect(z.string().min(3).safeParse("a").error?.issues[0].message).toMatch(/Terlalu kecil/);
  });
});
