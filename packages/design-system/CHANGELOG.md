# Changelog

## 0.3.0

### Minor Changes

- 8787959: Komponen `Tour` untuk mengenalkan alur fitur baru: menyorot elemen satu per satu di halaman yang sama. Step bisa menyiapkan tampilannya lewat `before` (mis. membuka Sheet yang memuat target) dan Tour menunggu sampai target muncul. Satu tur bisa memuat beberapa fitur lewat `group`: label fitur, progres dan titik per fitur, "Lewati fitur ini", dan tombol tutup. Teks tombol bisa diganti lewat `LocaleProvider` (`tour`). `Dialog` dan `Sheet` tidak lagi menutup saat tombol Tour ditekan.

### Patch Changes

- 208b301: Bundel diawali `"use client"` agar komponen bisa diimpor dari server component Next.js, dan batas input di skin clay kini terlihat (kontras ≥ 3:1).

## 0.2.2

### Patch Changes

- 98c0e5d: Lisensi MIT dan provenance npm.

## 0.2.1

### Patch Changes

- 84cdcc8: Tambah README dan metadata paket (deskripsi, kata kunci) agar halaman npmjs.com informatif.

## 0.2.0

### Minor Changes

- 40784cd: FormField, Alert, EmptyState, Avatar, Breadcrumb, Sheet, DataTable, LocaleProvider, prop `breadcrumb` di PageHeader. Detail di CHANGELOG bagian Unreleased.
- e2deade: `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`: submenu bertingkat di `DropdownMenu`. Detail di CHANGELOG bagian Unreleased.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), versi mengikuti [SemVer](https://semver.org/lang/id/). Setiap PR yang mengubah API publik, styling, atau token menambah satu baris di bagian **Unreleased**.

## [Unreleased]

### Added

- `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`: submenu bertingkat di `DropdownMenu` (Radix), dengan story `Submenu`.
- `LocaleProvider` + `useLocale` + `defaultLocale`: teks bawaan komponen (tutup, memuat, tidak ada data/hasil, placeholder Combobox, label Pagination, label DataTable) bisa diganti sekali di root untuk i18n; default tetap bahasa Indonesia, prop per komponen tetap mengalahkan.
- `Alert` (info/success/warning/danger, `live` untuk `role="alert"`), `EmptyState`, `Avatar` (Radix, fallback inisial, `initials()`), `Breadcrumb` (komposisi, `BreadcrumbLink asChild`), `Sheet` (Radix Dialog, `side` right/left/bottom), `DataTable` (TanStack Table v8: sorting klien/server, seleksi baris, loading, kosong, Pagination; re-export `createColumnHelper` dan tipe). `PageHeader` dapat prop `breadcrumb`. Ikon internal `ChevronRightIcon`.
- `FormField`: pembungkus Label + kontrol (render prop) + hint + error dengan `aria-describedby`/`aria-invalid` terhubung.
- Skin `neo` (neumorphism) lewat `data-skin`, prop `ThemeProvider skin`, token `--ds-shadow-raised`/`--ds-shadow-inset` (utilitas `shadow-raised`/`shadow-inset`, default `none`). Button non-ghost, Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, TabsList memakai token ini; tampilan default tidak berubah.
- Skin `glass` (glassmorphism) lewat `data-skin`: kaca 90% transparan (`surface` 10%), overlay 75%, backdrop Dialog berembun, `backdrop-filter: blur(20px) saturate(160%)`, latar body tiga blob.
- Token `surface-elevated` (permukaan melayang) dan `overlay` (backdrop Dialog); nilai default sama dengan sebelumnya.

### Changed

- `DropdownMenuContent` dan `DropdownMenuSubContent` dibatasi setinggi ruang yang tersedia di layar (`overflow-y-auto`), agar menu panjang bisa di-scroll.
- Popover, DropdownMenu, SelectContent, daftar Combobox, dan Toast default memakai `bg-surface-elevated`; backdrop Dialog memakai `bg-overlay`. Tampilan default dan skin neo tidak berubah.
- Pagination: daftar tombol membungkus baris (`flex-wrap`) dan target sentuh minimal 44px, agar tidak overflow di layar sempit.
- Teks default berbahasa Indonesia: tombol tutup Dialog/Toast "Tutup", `Spinner label` "Memuat", `Pagination label` "Navigasi halaman".

## [0.1.0] - 2026-11-02

Rilis awal, belum dipublikasikan ke registry.

### Added

- Token tiga lapis (`--ds-*` primitif dan semantik, dipetakan ke Tailwind v4 lewat `@theme inline`), tema `light`/`dark`/`system`, brand override lewat `data-brand`.
- `ThemeProvider`, `useTheme`, `themeInitScript`, `THEME_STORAGE_KEY`, util `cn`.
- Komponen inti: Button, Input, Textarea, Label, Badge, Checkbox, Radio, Switch, Spinner, Skeleton, Card.
- Komponen overlay dan navigasi di atas Radix UI: Dialog, Select, Combobox (cmdk), DropdownMenu, Tabs, Accordion, Tooltip (`TooltipProvider`), Popover, Toast (`ToastProvider`, `useToast`).
- Data dan layout: Pagination (+ `getPaginationRange`), Table primitives (+ `TableEmpty`), Container, Stack, PageHeader.
- Entry CSS `@wnp_code/design-system/styles.css`, output ESM + deklarasi tipe.

### Known limitations

- Hanya ESM, tanpa CJS.
- `data-brand` di subtree tidak menjangkau konten yang di-portal; pakai `ThemeProvider brand`.
- Kontras border/input terhadap background di bawah 3:1 (dicatat di `DESIGN-SYSTEM.md`).
