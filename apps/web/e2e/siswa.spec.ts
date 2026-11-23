import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("cari, pindah halaman, urutkan, dan tambah siswa lewat Sheet", async ({ page }) => {
  await login(page);
  await page.goto("/app/siswa");
  await expect(page.getByText("Aisyah Putri")).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(5);

  await page.getByRole("searchbox").fill("zzz");
  await expect(page.getByText(/Tidak ada siswa bernama/)).toBeVisible();
  await page.getByRole("searchbox").fill("");

  await page.getByRole("button", { name: "Halaman 2" }).click();
  // guru ada di company 1: siswa berid kelipatan 4 milik company 2 sehingga tidak tampil
  await expect(page.locator("tbody tr").first()).toContainText("Gita Permata");

  await page.getByRole("button", { name: "Urutkan menurut Nama" }).click();
  await page.getByRole("button", { name: "Urutkan menurut Nama" }).click();
  await expect(page.locator("tbody tr").first()).toContainText("Wahyu Setiawan");

  await page.getByRole("button", { name: "Tambah siswa" }).click();
  const dialog = page.getByRole("dialog", { name: "Tambah siswa" });
  await dialog.getByRole("button", { name: "Simpan" }).click();
  await expect(dialog.getByText("Nama wajib diisi.")).toBeVisible();
  await dialog.getByLabel("Nama lengkap").fill("Zahra Baru");
  await dialog.getByLabel("Kelas").fill("X IPA 3");
  await dialog.getByRole("button", { name: "Simpan" }).click();
  await expect(page.getByText("Siswa ditambahkan").first()).toBeVisible();
  await expect(dialog).toBeHidden();
});
