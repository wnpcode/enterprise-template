import type { Page } from "@playwright/test";

export async function login(page: Page, email = "guru@sekolah.id", password = "guru123") {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/^Kata sandi/).fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
  await page.waitForURL("**/app");
}

export const hasHorizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
