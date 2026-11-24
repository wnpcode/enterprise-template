---
"@wnp_code/design-system": minor
---

Komponen `Tour` untuk mengenalkan alur fitur baru: menyorot elemen satu per satu di halaman yang sama. Step bisa menyiapkan tampilannya lewat `before` (mis. membuka Sheet yang memuat target) dan Tour menunggu sampai target muncul. Satu tur bisa memuat beberapa fitur lewat `group`: label fitur, progres dan titik per fitur, "Lewati fitur ini", dan tombol tutup. Teks tombol bisa diganti lewat `LocaleProvider` (`tour`). `Dialog` dan `Sheet` tidak lagi menutup saat tombol Tour ditekan.
