# Implementation Assessment — Enterprise Design System

Tanggal: 2026-11-02. Dasar: inspeksi langsung direktori `enterprise-template/`.

## Kondisi awal repo
- Direktori hanya berisi `enterprise-design-system-agent-plan.md`. Bukan repo git. Tidak ada `package.json`, tidak ada kode, tidak ada `DESIGN-SYSTEM.md`.
- Tooling host: Node v20.20.2, pnpm 10.34.4, npm 10.8.2.
- Repo sibling di `~/PROJECT_AI` (`psp-lms-frontend-v2`, `admin-boilerplate-v4-clean`) memakai React 19.2, Tailwind 4.2, Vite 7/8, Vitest 4, TS 5.9/6.0. Dipakai sebagai acuan versi, bukan sebagai kode yang direuse.

## Infrastruktur yang bisa direuse
Tidak ada. Semua dibuat baru.

## Baseline checks
Tidak ada script yang bisa dijalankan (repo kosong). Tidak ada baseline failure.

## Gap terhadap spesifikasi
Seluruh Phase 1–7 belum ada. Sesi ini mengerjakan Phase 0–3 ditambah Storybook minimal dan quality gates untuk komponen inti.

## Keputusan dan deviasi
| Topik | Keputusan | Alasan |
|---|---|---|
| Lokasi | pnpm workspace baru: `packages/design-system`, `apps/playground` | Repo frontend yang disebut plan tidak ada (keputusan user) |
| Palet | Default netral, didokumentasikan di `DESIGN-SYSTEM.md` yang baru dibuat | File asli tidak ada (keputusan user) |
| Format build | ESM only + `.d.ts` | Consumer target Vite; CJS tidak dibutuhkan |
| CSS | Ship `styles.css` mentah (tokens + `@theme inline`), consumer compile Tailwind sendiri dengan `@source` ke dist | Pola library Tailwind v4, hindari CSS duplikat |
| Radix UI | Tidak dipakai di Phase 3 | Checkbox/Radio pakai `<input>` native, Switch pakai `<button role="switch">`. Radix masuk Phase 4 |
| Icon lib | Tidak dipasang | Spinner pakai SVG inline |
| Theme persist | `localStorage["ds-theme"]` + `themeInitScript` inline | Tidak ada mekanisme existing |

## Rencana file
Lihat struktur di `README.md`.

## Hasil cek kontras (2026-11-02, skrip luminance WCAG, bukan audit manual)
Dicek 15 pasangan per tema (lihat `DESIGN-SYSTEM.md` §4).
- Awal: light `success/warning/info-foreground` di atas warnanya 3.2–4.1:1; dark `primary-foreground/primary` 3.7:1 dan `danger-foreground/danger` 3.8:1. Semua di bawah 4.5:1.
- Perbaikan: light success/warning/info → shade 700; dark primary-foreground dan danger-foreground → slate-950. Setelah itu semua pasangan teks ≥ 4.5:1 (terendah: light `danger-foreground/danger` 4.83, dark `primary-foreground/primary` 5.3).
- Tersisa: `border/background` 1.23 (light) dan 1.38 (dark), `input/background` serupa. Border dekoratif; batas input tidak memenuhi 3:1 (WCAG 1.4.11) dan mengandalkan label + focus ring. Dicatat, belum diubah.

## Catatan tooling
- TypeScript 7 dan ESLint 10 terbaru belum didukung typescript-eslint, vite-plugin-dts, jsx-a11y → dipin TS 5.9, ESLint 9.
- jsdom 30 menarik undici 8 yang butuh zstd Node 22; host Node 20 → dipin jsdom 26.
- `bundleTypes` vite-plugin-dts butuh `@microsoft/api-extractor` → tidak dipakai; `dist/` berisi `.d.ts` per file yang di-re-export `index.d.ts`.
- Plugin dts difilter dari Vite config Storybook (`viteFinal`) agar tidak menulis `.d.ts` ke `storybook-static`.

## Hasil quality gates (2026-11-02)
Otomatis, semua exit 0: `pnpm typecheck`, `pnpm lint`, `pnpm test` (12 file, 101 test), `pnpm build` (package + playground), `pnpm build-storybook`. Bundle CSS playground memuat utilitas semantik (`bg-primary`, `aria-checked:`, `bg-danger-subtle`); JS playground tidak memuat path `src/` package.

Manual via Playwright headless terhadap `apps/playground` (skrip sekali pakai, tidak disimpan di repo): tema light→dark berubah tanpa reload; pilihan bertahan setelah reload (`localStorage["ds-theme"]`); `system` mengikuti `prefers-color-scheme`; `data-brand="acme"` mengganti primary (dark: `#8b5cf6`) tanpa perubahan API; Switch toggle `aria-checked`; Button `loading` memasang `aria-busy`; tidak ada error/warning konsol. Screenshot light mode diperiksa visual: hierarki, state invalid/disabled/loading tampil sesuai.

Belum diverifikasi: tampilan Storybook di browser dan laporan addon-a11y runtime (hanya `build-storybook` yang dijalankan); pembacaan screen reader; kontras hanya lewat skrip luminance.

## Phase 4 batch 1 (2026-11-02)
Cakupan (keputusan user): Dialog, Select, Combobox, DropdownMenu, Tabs, Accordion, Tooltip, Popover, Toast.

| Topik | Keputusan | Alasan |
|---|---|---|
| Dependency | `radix-ui` 1.8 (package tunggal), `cmdk` 1.1 | Primitif aksesibel untuk interaksi kompleks; Radix tidak punya Combobox |
| Ikon | `src/components/icons.tsx` (Chevron, Check, X inline SVG) | Tiga ikon tidak membenarkan library ikon |
| Animasi | Fade in/out saja (`--animate-fade-in/out`), `motion-reduce:animate-none` | Cukup untuk overlay; tanpa library animasi |
| Portal & brand | Konten Radix di `<body>`; `data-brand` subtree tidak menjangkau portal | Didokumentasikan di README; pakai `ThemeProvider brand` |
| jsdom | Polyfill `ResizeObserver`, `scrollIntoView`, pointer capture di `src/test/setup.ts` | Dibutuhkan Radix Select/DropdownMenu dan cmdk |
| Dilewati | DropdownMenu RadioItem/Sub/Shortcut, Toast action button, AlertDialog, Sheet | Tidak diminta |

Perbaikan dari review internal yang diterapkan bersamaan: semua dependency (bukan hanya React) di-external dari bundle library (`dist/index.js` 49 KB → 24.6 KB, consumer memakai satu salinan Radix); efek `brand` di `ThemeProvider` tidak lagi menghapus `data-brand` statis dan membersihkan diri saat unmount; `aria-invalid` di Checkbox/Switch dipasang setelah spread props agar konsisten dengan Input/Textarea; `DESIGN-SYSTEM.md` tidak lagi menyebut variabel spacing/tipografi yang tidak ada; playground memasang brand lewat `ThemeProvider` agar menjangkau portal.

Hasil gate (2026-11-02), semua exit 0: `pnpm typecheck`, `pnpm lint`, `pnpm test` (21 file, 170 test), `pnpm build`, `pnpm build-storybook`. Bundle CSS playground memuat `data-[state=open]` dan `animate-fade-in`; `dist/index.js` hanya mengimpor `react`, `react/jsx-runtime`, `radix-ui`, `cmdk`, `clsx`, `tailwind-merge`, `class-variance-authority`.

Manual via Playwright headless di playground (skrip sekali pakai): Dialog membuka dengan fokus di dalam, Escape menutup dan fokus kembali ke trigger; `--ds-color-primary` di dalam portal Dialog = `#7c3aed` saat brand acme aktif lewat ThemeProvider; Select memilih via klik dan keyboard; Combobox ketik "8A" + Enter memilih "Kelas 8A"; DropdownMenu 4 item, pilih item memicu toast; Tabs ArrowRight memindahkan tab dan panel; Accordion membuka; Tooltip tampil saat hover; Toast success memakai `success-subtle`; tidak ada error/warning konsol. Screenshot light dan dark diperiksa visual.

Belum diverifikasi: Storybook di browser dan laporan addon-a11y runtime; pembacaan screen reader; auto-dismiss Toast (timer); perilaku sentuh/swipe Toast.

## Phase 4 batch 2 (2026-11-02): Pagination, Table, Layout
- Pagination: satu komponen (`page`, `pageCount`, `onPageChange`, `siblingCount`) + helper murni `getPaginationRange` yang diuji table-driven. Tanpa sub-part ala shadcn.
- Table: primitives saja tanpa dependency (keputusan user, bukan TanStack). State empty lewat `TableEmpty`; loading lewat baris `Skeleton` oleh consumer. Sorting/paging milik consumer.
- Layout: `Container` (size sm/md/lg/full), `Stack` (direction/gap/align/justify/wrap, kelas statis), `PageHeader` (title/description/actions). Dilewati: AppShell/sidebar, Grid, Breadcrumb.

Koreksi setelah review: `getPaginationRange` menampilkan semua halaman bila `pageCount <= 2 * siblingCount + 5`, sehingga elipsis tidak pernah menggantikan hanya satu-dua halaman (kasus (1,5,1) → 1..5).

Hasil gate (2026-11-02), semua exit 0: typecheck, lint, test (24 file, 204 test), build (`dist/index.js` 30 KB), build-storybook. Playwright headless di playground: 23 siswa dibagi 5 per halaman → 5 halaman tanpa elipsis, halaman pertama 5 baris, halaman 5 berisi 3 baris, tombol Sebelumnya/Berikutnya nonaktif di ujung, `aria-current="page"` berpindah, PageHeader berupa `h1`; tidak ada error konsol. Screenshot diperiksa visual.

## Phase 5 dan 7 (2026-11-02)
- Phase 5: setiap `*.stories.tsx` (23 komponen) mendapat `parameters.docs.description.component` berisi tujuan, import, keyboard/fokus, Do/Don't; props dari autodocs. Foundations (colors, typography, spacing, radius, shadows) sudah ada di `stories/Foundations.stories.tsx`; tema light/dark lewat toolbar. Tidak ada halaman MDX terpisah (opsi lebih kecil).
- Phase 7: `packages/design-system/CHANGELOG.md` (Keep a Changelog, 0.1.0), `CONTRIBUTING.md` di root (checklist komponen, review API, SemVer manual tanpa changesets, deprecation = JSDoc `@deprecated` + minimal satu rilis minor, langkah rilis). `pnpm pack --dry-run` menghasilkan hanya `dist/**` + `package.json`. Konsumsi lewat workspace diverifikasi oleh `apps/playground` (import dari `@wnpcode/design-system` dan `/styles.css`); konsumsi dari tarball/registry belum dicoba.
- Deviasi: package belum pernah dipublikasikan, tidak ada field `license`/`repository` di package.json (template, diisi saat adopsi).

## Verifikasi tambahan (2026-11-02)
- Teks default diubah ke Bahasa Indonesia: "Tutup" (Dialog, Toast), `Spinner label` "Memuat", `Pagination label` "Navigasi halaman"; test disesuaikan.
- Storybook build disajikan statis dan dicek headless Playwright: Docs Button/Dialog (deskripsi, import, props, Do/Don't), story Dialog tema dark, Foundations Colors; konsol bersih.
- Konsumsi dari tarball `pnpm pack` di consumer terisolasi di luar workspace: install, render SSR Button, resolve `styles.css`, 77 export, `tsc --strict` lolos.
- Laporan akhir: `final-report.md`.

## Ditunda
Playwright e2e di repo, CJS output, publish ke registry, audit a11y manual.
