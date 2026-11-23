import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { SKIN_STORAGE_KEY, SkinProvider, useSkin } from "./skin";

const wrapper = ({ children }: { children: ReactNode }) => <SkinProvider>{() => children}</SkinProvider>;

describe("readSkin", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("memakai nilai tersimpan yang dikenal", () => {
    localStorage.setItem(SKIN_STORAGE_KEY, "glass");
    const { result } = renderHook(useSkin, { wrapper });
    expect(result.current.skin).toBe("glass");
  });

  it("mengenali skin baru", () => {
    localStorage.setItem(SKIN_STORAGE_KEY, "swiss");
    const { result } = renderHook(useSkin, { wrapper });
    expect(result.current.skin).toBe("swiss");
  });

  it("jatuh ke neo untuk nilai tak dikenal", () => {
    localStorage.setItem(SKIN_STORAGE_KEY, "xyz");
    const { result } = renderHook(useSkin, { wrapper });
    expect(result.current.skin).toBe("neo");
  });
});
