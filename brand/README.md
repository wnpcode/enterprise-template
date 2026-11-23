# Logo enterprise-template

Tiga bilah horizontal rata kiri dengan panjang berbeda.

- Terbaca sebagai huruf **E** dari enterprise-template.
- Tiga lapis monorepo: design system, app, fitur. Bilah terbawah paling panjang karena menjadi fondasi.
- Bentuknya mirip menu sidebar, jadi terbaca sebagai produk webadmin.

## File

| File | Pakai untuk |
|---|---|
| `mark.svg` | Logo satu warna, `fill="currentColor"`, mengikuti warna teks |
| `logo.svg` | Mark berwarna primary, untuk tempat yang tidak mewarisi warna (Storybook) |
| `icon.svg` | Ikon app: latar primary rx 7, bilah putih. Juga favicon |
| `icon-maskable.svg` | Ikon PWA maskable: latar penuh, bilah diskalakan 0.8 di zona aman |
| `generate.sh` | Render PNG ke `apps/web/public` dan salin favicon ke playground (butuh inkscape) |

Bentuk inline untuk komponen React ada di `apps/web/src/shared/LogoMark.tsx`. Ubah di dua tempat bila bentuknya diganti.

## Konstruksi

Grid 32×32. Semua koordinat genap agar tajam di 16 px (1 unit = 0,5 px).

| Bilah | x | y | lebar | tinggi | rx |
|---|---|---|---|---|---|
| atas | 6 | 6 | 14 | 4 | 1 |
| tengah | 6 | 14 | 10 | 4 | 1 |
| bawah | 6 | 22 | 20 | 4 | 1 |

- Warna: `#2563eb` (`--ds-blue-600`, token `primary`). Di atas latar gelap pakai `mark.svg` dengan `text-primary`.
- Ukuran minimum: 16 px.
- Ruang kosong di sekeliling logo minimal setinggi satu bilah.

## Jangan

- Memiringkan, memutar, atau mencerminkan logo.
- Memberi gradien, bayangan, atau outline.
- Membulatkan bilah menjadi pil.
- Mengubah urutan panjang bilah (sedang, pendek, panjang).

## Mengganti untuk proyek baru

Ganti keempat SVG dengan logo produk, perbarui `LogoMark.tsx`, lalu jalankan `brand/generate.sh`.
