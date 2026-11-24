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

test("tur siswa muncul sekali pada kunjungan pertama dan bisa diulang", async ({ page }) => {
  await login(page, undefined, undefined, { tourSeen: false });
  await page.goto("/app/siswa");
  const tour = page.getByRole("dialog", { name: "Cari siswa" });
  // fitur Pencarian hanya satu step: label fitur tampil, nomor langkah tidak
  await expect(tour).toContainText("Pencarian");
  await expect(tour).not.toContainText("Langkah");
  const sheet = page.getByRole("dialog", { name: "Tambah siswa", exact: true });

  // fokus ada di tombol utama, jadi Enter saja cukup untuk maju
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Tambah siswa baru" })).toBeVisible();
  await expect(sheet).toHaveCount(0);
  await page.keyboard.press("Enter");
  const nama = page.getByRole("dialog", { name: "Isi nama siswa" });
  await expect(nama).toBeVisible();
  await expect(nama).toContainText("Langkah 2 dari 4");
  await expect(sheet).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Isi kelas" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Simpan", exact: true })).toBeVisible();
  await expect(sheet).toBeVisible();
  await page.keyboard.press("Enter");
  const akhir = page.getByRole("dialog", { name: "Ubah atau hapus" });
  await expect(akhir).toBeVisible();
  await expect(sheet).toHaveCount(0);
  await akhir.getByRole("button", { name: "Selesai" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.reload();
  await expect(page.getByText("Aisyah Putri")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Lihat tur" }).click();
  await expect(page.getByRole("dialog", { name: "Cari siswa" })).toBeVisible();
});

test("pengguna lama hanya melihat step fitur baru", async ({ page }) => {
  await login(page, undefined, undefined, { tourSeen: ["siswa-cari", "siswa-tambah"] });
  await page.goto("/app/siswa");
  const tour = page.getByRole("dialog", { name: "Ubah atau hapus" });
  await expect(tour).toContainText("Ubah dan hapus");
  await expect(tour).not.toContainText("Langkah");
  await expect(tour.getByRole("button", { name: "Tutup" })).toHaveCount(0);
  await tour.getByRole("button", { name: "Selesai" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Lihat tur" }).click();
  await expect(page.getByRole("dialog", { name: "Cari siswa" })).toContainText("Pencarian");
});

test("lewati satu fitur dan tutup seluruh tur", async ({ page }) => {
  await login(page, undefined, undefined, { tourSeen: false });
  await page.goto("/app/siswa");
  await expect(page.getByRole("dialog", { name: "Cari siswa" })).toBeVisible();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog", { name: "Tambah siswa baru" }).getByRole("button", { name: "Lewati fitur ini" }).click();

  // fitur Tambah siswa dilompati seluruhnya; Sheet tidak pernah terbuka
  const aksi = page.getByRole("dialog", { name: "Ubah atau hapus" });
  await expect(aksi).toContainText("Ubah dan hapus");
  await expect(page.getByRole("dialog", { name: "Tambah siswa", exact: true })).toHaveCount(0);

  await aksi.getByRole("button", { name: "Tutup" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // yang dilewati dan yang ditutup tetap dicatat sudah dilihat
  await page.reload();
  await expect(page.getByText("Aisyah Putri")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
