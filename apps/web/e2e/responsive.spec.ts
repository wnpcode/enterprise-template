import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow, login } from "./helpers";

test("landing dan login tanpa overflow horizontal", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await hasHorizontalOverflow(page)).toBe(false);
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Masuk" })).toBeVisible();
  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("dashboard dan siswa tanpa overflow horizontal", async ({ page }) => {
  await login(page);
  expect(await hasHorizontalOverflow(page)).toBe(false);
  await page.goto("/app/siswa");
  await expect(page.getByText("Aisyah Putri")).toBeVisible();
  expect(await hasHorizontalOverflow(page)).toBe(false);
});
