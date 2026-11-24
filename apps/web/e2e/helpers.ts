import type { Page } from "@playwright/test";

// tur terbuka sendiri pada kunjungan pertama dan menutupi halaman; tandai semua sudah dilihat kecuali test-nya menguji tur
// (tourSeen: false = belum ada yang dilihat, array = id step yang sudah dilihat)
export async function login(
  page: Page,
  email = "guru@sekolah.id",
  password = "guru123",
  { tourSeen = ["*"] }: { tourSeen?: string[] | false } = {},
) {
  if (tourSeen) await page.addInitScript((seen) => localStorage.setItem("web-tour-seen", JSON.stringify(seen)), tourSeen);
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/^Kata sandi/).fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
  await page.waitForURL("**/app");
}

export const hasHorizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
