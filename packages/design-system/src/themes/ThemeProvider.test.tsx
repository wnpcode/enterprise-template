import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme, THEME_STORAGE_KEY } from "./ThemeProvider";

let darkListeners: Array<() => void> = [];
let systemDark = false;

function mockMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    get matches() {
      return systemDark;
    },
    addEventListener: (_: string, cb: () => void) => darkListeners.push(cb),
    removeEventListener: (_: string, cb: () => void) => {
      darkListeners = darkListeners.filter((l) => l !== cb);
    },
  }));
}

function Switcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="state">{`${theme}/${resolvedTheme}`}</span>
      <button onClick={() => setTheme("dark")}>dark</button>
      <button onClick={() => setTheme("system")}>system</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  darkListeners = [];
  systemDark = false;
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.brand;
  delete document.documentElement.dataset.skin;
  mockMatchMedia();
});

describe("ThemeProvider", () => {
  it("defaults to system and writes data-theme", () => {
    render(
      <ThemeProvider>
        <Switcher />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state")).toHaveTextContent("system/light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("explicit choice overrides system and persists", async () => {
    systemDark = false;
    render(
      <ThemeProvider>
        <Switcher />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByText("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("restores stored preference", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    render(
      <ThemeProvider>
        <Switcher />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("state")).toHaveTextContent("dark/dark");
  });

  it("follows system changes when theme is system", () => {
    render(
      <ThemeProvider>
        <Switcher />
      </ThemeProvider>,
    );
    act(() => {
      systemDark = true;
      darkListeners.forEach((l) => l());
    });
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("applies brand attribute", () => {
    render(
      <ThemeProvider brand="acme">
        <Switcher />
      </ThemeProvider>,
    );
    expect(document.documentElement.dataset.brand).toBe("acme");
  });

  it("applies and removes skin attribute", () => {
    const { unmount } = render(
      <ThemeProvider skin="neo">
        <Switcher />
      </ThemeProvider>,
    );
    expect(document.documentElement.dataset.skin).toBe("neo");
    unmount();
    expect(document.documentElement.dataset.skin).toBeUndefined();
  });

  it("useTheme throws outside provider", () => {
    expect(() => render(<Switcher />)).toThrow(/ThemeProvider/);
  });
});
