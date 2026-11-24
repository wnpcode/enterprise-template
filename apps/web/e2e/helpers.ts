import type { Page } from "@playwright/test";
import { RELEASES } from "../src/shared/releases";

// tur terbuka sendiri pada kunjungan pertama dan menutupi halaman; tandai semua sudah dilihat sampai rilis terbaru kecuali
// test-nya menguji tur (tourSeen: false = belum ada catatan, string = versi terakhir yang sudah dilihat di halaman Siswa)
export async function login(
  page: Page,
  email = "guru@sekolah.id",
  password = "guru123",
  { tourSeen = RELEASES[0].version }: { tourSeen?: string | false } = {},
) {
  if (tourSeen) {
    const seen = tourSeen === RELEASES[0].version ? { "*": tourSeen } : { siswa: tourSeen };
    // hanya bila belum ada: init script berjalan di setiap navigasi, termasuk reload, dan tidak boleh menimpa catatan yang ditulis tur
    await page.addInitScript((value) => {
      if (!localStorage.getItem("web-tour-version")) localStorage.setItem("web-tour-version", JSON.stringify(value));
    }, seen);
  }
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/^Kata sandi/).fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
  await page.waitForURL("**/app");
}

export const hasHorizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
