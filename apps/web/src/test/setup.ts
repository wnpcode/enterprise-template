import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub;
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.hasPointerCapture = vi.fn(() => false);
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();
// jsdom tidak punya matchMedia; gsap.matchMedia (landing) membutuhkannya
window.matchMedia = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
}));
import "../app/i18n";
import { server } from "../mocks/server";
import { RELEASES } from "../shared/releases";
import { ALL_PAGES, TOUR_STORAGE_KEY } from "../shared/useTour";

// tur terbuka sendiri pada kunjungan pertama; test lain tidak boleh terganggu olehnya
beforeEach(() => localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify({ [ALL_PAGES]: RELEASES[0].version })));

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
