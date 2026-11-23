import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("login, sesi bertahan setelah reload, lalu keluar", async ({ page }) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login$/);
  await login(page);
  await expect(page.getByText("Menunggu verifikasi", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("banner").getByText("Budi Guru")).toBeVisible();
  await page.getByRole("button", { name: /Budi Guru/ }).click();
  await page.getByRole("menuitem", { name: "Keluar" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login$/);
});

test("role guru tidak bisa membuka halaman admin", async ({ page }) => {
  await login(page);
  await page.goto("/app/komponen");
  await expect(page.getByRole("heading", { name: "Akses ditolak" })).toBeVisible();
});
