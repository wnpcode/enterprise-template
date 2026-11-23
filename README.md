<img src="brand/icon.svg" width="48" height="48" alt="">

# enterprise-template

pnpm workspace berisi design system reusable (`packages/design-system`) dan app fixture (`apps/playground`).
Spesifikasi: `enterprise-design-system-agent-plan.md`. Token: `DESIGN-SYSTEM.md`. Assessment: `docs/design-system/implementation-assessment.md`. Tutorial langkah demi langkah untuk developer baru: `docs/TUTORIAL.md`.

Prasyarat: Node 20+, pnpm 10.

```bash
pnpm install
pnpm build            # package + playground
pnpm test             # vitest
pnpm typecheck
pnpm lint
pnpm storybook        # http://localhost:6006
pnpm dev              # playground, http://localhost:5173
```

## Struktur

```text
packages/design-system/   @wnp_code/design-system (ESM + .d.ts + styles.css)
  src/styles/index.css    token --ds-*, tema light/dark, brand, @theme inline
  src/themes/             ThemeProvider, useTheme, themeInitScript
  src/components/<Name>/  <Name>.tsx, .test.tsx, .stories.tsx, index.ts
  src/index.ts            satu-satunya entry publik
  stories/                Foundations
apps/playground/          consumer fixture, import hanya dari export publik
```

## Memakai package di app lain (Tailwind CSS v4)

1. Install dari npmjs.com (publik, tanpa token atau `.npmrc`): `pnpm add @wnp_code/design-system` (peer: `react@^19`, `react-dom@^19`, `tailwindcss@^4` di app).
2. CSS entry app:

```css
@import "tailwindcss";
@import "@wnp_code/design-system/styles.css";
@source "../node_modules/@wnp_code/design-system/dist";
```

`@source` wajib agar utilitas Tailwind yang dipakai komponen ikut di-generate oleh app. Package tidak mengirim CSS Tailwind yang sudah dikompilasi.

3. Bungkus app dengan `ThemeProvider`, `TooltipProvider`, dan `ToastProvider`; pasang `themeInitScript` di `<head>` agar tidak ada flash tema:

```tsx
import { ThemeProvider, TooltipProvider, ToastProvider, Button } from "@wnp_code/design-system";

<ThemeProvider>
  <TooltipProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </TooltipProvider>
</ThemeProvider>
```

```html
<script>/* isi dari export themeInitScript */</script>
```

Lihat `apps/playground/index.html` dan `apps/playground/src/main.tsx` untuk contoh lengkap.

## Theming

- `theme`: `light` | `dark` | `system`. Pilihan eksplisit mengalahkan preferensi OS. Disimpan di `localStorage["ds-theme"]`.
- `ThemeProvider` menulis `data-theme` hasil resolusi ke `<html>`. CSS hanya membaca `[data-theme]`, bukan `prefers-color-scheme`.
- Brand: `ThemeProvider brand="acme"` menulis `data-brand` ke `<html>`; atau pasang `data-brand` di subtree mana pun. Brand hanya mengganti token semantik (`--ds-color-primary`, dst.), API komponen tidak berubah. Tambah brand baru dengan blok `[data-brand="nama"]` di CSS app.
- Skin: `ThemeProvider skin="neo"` menulis `data-skin` ke `<html>` dan mengaktifkan neumorphism (kontrol timbul/cekung lewat token `--ds-shadow-raised`/`--ds-shadow-inset`). Tanpa skin, tampilan flat. Skin tersedia: `neo`, `glass`, `clay`, `fluid`, `aurora`, `swiss`. Bisa digabung dengan brand.
- Komponen hanya memakai token semantik (`bg-primary`, `text-muted-foreground`, …). Daftar token dan nilai: `DESIGN-SYSTEM.md`.
- Konten overlay (Dialog, Select, Dropdown, Tooltip, Popover, Toast) di-portal ke `<body>`. `data-theme` di `<html>` tetap berlaku, tetapi `data-brand` yang dipasang di subtree tidak menjangkau portal. Pasang brand lewat `ThemeProvider brand="..."` agar konsisten.

## Menambah komponen, rilis, deprecation

Lihat `CONTRIBUTING.md` (checklist komponen, review API publik, SemVer, langkah rilis) dan `packages/design-system/CHANGELOG.md`. Dokumentasi per komponen (tujuan, import, keyboard, Do/Don't) ada di tab Docs setiap story Storybook (`pnpm storybook`); props dirender otomatis dari tipe TypeScript.

## Komponen

- Inti: Button, Input, Textarea, Label, FormField, Badge, Alert, Avatar, Checkbox, Radio, Switch, Spinner, Skeleton, Card.
- Overlay dan navigasi (di atas Radix UI, Combobox memakai cmdk): Dialog, Sheet, Select, Combobox, DropdownMenu, Tabs, Accordion, Tooltip, Popover, Toast (`ToastProvider` + `useToast()`).
- Data dan layout: Pagination (+ `getPaginationRange`), Table primitives (Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, TableEmpty), DataTable (TanStack Table v8: kolom via `createColumnHelper`, sorting klien atau `manualSorting`, seleksi baris, loading, `empty`, Pagination; label bisa diganti lewat `labels`), EmptyState, Breadcrumb (`BreadcrumbLink asChild` untuk `<Link>` router), Container, Stack, PageHeader (+ prop `breadcrumb`).

## Boilerplate app (`apps/web`)

Starter app yang memakai package ini: landing, login (mock), dashboard dengan sidebar vertikal/horisontal yang bisa diciutkan jadi ikon, bottom nav di ponsel, PWA. Identitas contoh "Portal Sekolah".

```bash
pnpm dev:web                     # http://localhost:5173
pnpm --filter web build && pnpm --filter web preview   # build + service worker
```

### Struktur feature-based

- `src/app/`: komposisi aplikasi. `App.tsx` (provider), `routes.tsx` (semua route), `layouts/` (Landing, Auth, Dashboard), `shell/` (Sidebar, Topbar, BottomNav, `nav.ts`, `useLayoutPrefs`).
- `src/features/<fitur>/`: semua milik fitur (halaman, komponen, data/api, test) dengan satu `index.ts` sebagai public API. Fitur lain dan router hanya mengimpor dari `index.ts` itu. Fitur yang ada: `auth`, `landing`, `dashboard`, `siswa`, `pengaturan`, `komponen` (halaman demo tiap komponen design system di `/app/komponen`, registry di `features/komponen/demos/index.ts`; hapus folder ini plus route dan item nav-nya saat app dipakai produksi).
- `src/shared/`: hal lintas fitur yang bukan milik satu fitur (`NotFoundPage`).

Menambah fitur: buat `src/features/<nama>/` + `index.ts`, tambah route di `routes.tsx`, tambah item di `app/shell/nav.ts` bila perlu muncul di navigasi. Menghapus fitur: hapus foldernya dan dua baris itu.

### Memulai proyek baru dari template

1. Salin repo, ganti logo di `brand/` (SVG) lalu jalankan `brand/generate.sh` (butuh inkscape) untuk favicon dan ikon PWA; bentuk inline di `src/shared/LogoMark.tsx` ikut diganti. Ganti nama produk: cukup `VITE_APP_NAME` di `apps/web/.env` (dipakai `<title>`, manifest PWA, `BrandMark`, dan teks locale lewat `{{appName}}`); deskripsi dan domain juga di `.env` (`VITE_APP_DESCRIPTION`, `VITE_SITE_URL`); sisanya hanya tagline di `src/locales/*.json` (`app.tagline`, `landing.*`, `seo.*`) dan ikon di `public/`.
2. Env: salin `.env.example` ke `.env.local`, isi `VITE_API_URL`; `VITE_API_MOCK=0` bila backend sudah ada.
3. Auth: sesuaikan path dan bentuk respons di `features/auth/api.ts` dengan backend; tentukan nama role dan pasang `roles` di `nav.ts` dan `RequireRole` di `routes.tsx`.
4. Fitur: hapus `features/komponen` (plus route dan item nav), ganti `features/siswa` dengan domain nyata memakai pola yang sama (api.ts + keys, useQuery, DataTable, Sheet + useMutation).
5. MSW: sesuaikan atau hapus handler di `src/mocks/` sesuai kontrak backend; test memakai handler yang sama.
6. Bahasa: hapus `en.json` dan `LANGUAGES` di `src/app/i18n.ts` bila satu bahasa saja.
7. Jalankan `pnpm install` (memasang hook husky), lalu `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm e2e`.

### Yang harus diganti saat dipakai sungguhan

- Auth: kontrak REST + Bearer JWT ada di `features/auth/api.ts` (`POST /auth/login|refresh|register|forgot|reset|password`, `GET|PATCH /auth/me`, `GET /auth/companies`); sesuaikan path dan bentuk respons dengan backend, selebihnya (`AuthProvider`, guard, halaman) tidak perlu berubah. Tanpa backend, MSW (`src/mocks/auth.ts`) menyediakan akun `admin@sekolah.id / admin123` (role `admin`) `guru@sekolah.id / guru123` (role `guru`), dan `superadmin@sekolah.id / super123` (role `superadmin`, 25 company); tautan reset dicetak ke konsol saat "Lupa kata sandi".
- Data: `features/siswa/api.ts` memanggil `GET /siswa?q=&page=&size=&sort=&order=`, `POST /siswa`, `PATCH /siswa/:id` (ubah nama/kelas atau status), dan `DELETE /siswa/:id` lewat `shared/api/client.ts` dan dipakai halaman dengan TanStack Query (`useQuery`, key di `siswaKeys`). Tanpa backend, MSW (`src/mocks/handlers.ts`) menjawab dari `features/siswa/contoh.ts`; sesuaikan handler dengan kontrak backend atau matikan lewat `VITE_API_MOCK=0`.
- Ikon: `public/favicon.svg`, `pwa-192.png`, `pwa-512.png`, `pwa-maskable-512.png`, `apple-touch-icon.png` dibuat dari `brand/` oleh `brand/generate.sh` dan memakai logo template. Ganti SVG di `brand/` dengan logo produk lalu jalankan ulang skripnya. Panduan logo: `brand/README.md`.
- Identitas produk hanya didefinisikan di `apps/web/.env`: `VITE_APP_NAME` (nilai contoh "Portal Sekolah"), `VITE_APP_DESCRIPTION` (deskripsi manifest PWA), dan `VITE_SITE_URL` (domain produksi untuk `robots.txt` dan `sitemap.xml` yang dibuat saat build oleh plugin `siteFiles` di `vite.config.ts`). `index.html` (`%VITE_APP_NAME%`), manifest di `vite.config.ts`, `BrandMark`, dan teks locale (`{{appName}}` lewat `interpolation.defaultVariables` di `src/app/i18n.ts`) membacanya dari sana. `.env.local` mengalahkan `.env`.
- Landing: section di `features/landing/sections/` (Hero, Fitur, Harga, Testimoni, Faq, Kontak); teks, paket harga, testimoni, dan FAQ ada di `src/locales/<lang>.json` (`landing.*`, dibaca lewat `useLandingContent`). Form kontak mengirim `POST /kontak` (handler MSW tersedia). Header dan footer landing (`app/layouts/LandingLayout.tsx`) memuat anchor section, pilihan bahasa, dan tema.
- SEO: `shared/Seo.tsx` merender `<title>`, `description`, dan Open Graph (React 19 memindahkannya ke `<head>`, tanpa react-helmet); dipakai landing, login, register, dan `DashboardLayout` (`noindex`). `public/robots.txt` dan `public/sitemap.xml` memakai domain placeholder `portal.contoh.sch.id`; ganti sebelum rilis. `og:image` memakai ikon PWA.
- Animasi: landing page memakai GSAP (`gsap.matchMedia`, dilewati saat `prefers-reduced-motion`; hero stagger, section lain muncul lewat `[data-reveal]` + ScrollTrigger); komponen lain tetap animasi CSS design system.
- Font: Inter Variable dimuat self-hosted lewat `@fontsource-variable/inter` di `src/app/styles.css` dan di-override ke token `--ds-font-sans`. Ganti font di satu tempat itu.

### Lapisan data dan form

- Env: `.env.example` berisi semua variabel; `.env.development` mengaktifkan MSW dan `VITE_API_URL=/api`. Semua dibaca lewat `src/app/env.ts` (schema zod, gagal cepat saat nilai tidak valid). Jangan pakai `import.meta.env` langsung.
- API client: `src/shared/api/client.ts`, fungsi `api<T>(path, { method, json })` di atas `fetch`: prefix `VITE_API_URL`, header `Authorization: Bearer` dari hook auth, 401 → `refresh()` sekali lalu ulang, gagal → `onUnauthorized()`. Error jadi `ApiError { status, message, details }`.
- TanStack Query: `QueryClientProvider` di `App.tsx` (`retry: 1`, `staleTime: 30s`). Pola: `queryKey` dari `<fitur>Keys`, `queryFn` memanggil fungsi di `features/<fitur>/api.ts`.
- MSW: `src/mocks/handlers.ts` (satu handler per endpoint), `browser.ts` dinyalakan di `main.tsx` hanya saat dev dan `VITE_API_MOCK=1`, `server.ts` dipasang di `src/test/setup.ts` untuk vitest (`server.use(...)` per test untuk skenario error). Worker: `public/mockServiceWorker.js` (regenerasi dengan `npx msw init public`).
- Form: react-hook-form + zod (`zodResolver`) dengan komponen `FormField` dari design system; contoh di `features/auth/LoginPage.tsx`. Contoh CRUD lengkap: `features/siswa` (DataTable dengan pencarian, sorting, dan halaman di URL; `SiswaFormSheet` untuk tambah dan ubah; `HapusSiswaDialog` dengan konfirmasi; semua mutasi memakai `useMutation` dan `invalidateQueries`; aksi baris lewat `DropdownMenu`, sheet dan dialog dikendalikan dari halaman karena item menu menutup menu saat dipilih). Pesan bawaan zod berbahasa Indonesia lewat `src/app/zod.ts`.
- Error: `shared/RouteErrorBoundary.tsx` dipasang sebagai route tanpa path di dalam tiap layout (`routes.tsx`); halaman yang melempar error diganti `ErrorPage` tanpa merobohkan shell dan pulih saat pindah halaman.

### Multi-company

- Setelah login berhasil, `AuthProvider` memanggil `GET /auth/companies` **sekali** (`{ items: Company[], defaultId }`) dan menyimpannya di sesi (`localStorage["web-auth"]`: `companies`, `companyId`); reload tidak memanggilnya lagi dan logout menghapusnya. Bila pemanggilan gagal, login dianggap gagal. Sesi lama tanpa `companies` ditolak sekali dan pengguna login ulang.
- Superadmin menerima semua company, role lain hanya company miliknya (satu item, pilihan ganti disembunyikan). Company terpilih awal = `defaultId`; ganti lewat `Combobox` berpencarian di header (`app/shell/CompanySwitcher.tsx`; di footer sidebar saat header disembunyikan, dan tidak tampil saat sidebar diciutkan), yang juga memuat ulang semua query. Di kode: `useAuth()` → `companies`, `company`, `selectCompany(id)`.
- Id company **tidak dikirim otomatis**; tiap endpoint memasangnya sendiri lewat `selectedCompanyId()` (`shared/api/client.ts`, `null` bila belum login, jangan kirim): query `qs.set("company_id", String(id))` (contoh `fetchSiswa`), body `{ ...input, company_id: id }` (contoh `createSiswa`), atau path `` `/companies/${id}/...` ``.
- Mock: `mocks/handlers.ts` memfilter siswa per `company_id`. Tanpa parameter itu semua data dikembalikan; backend nyata harus mewajibkannya dan memeriksa bahwa pengguna berhak atas company tersebut.

### Auth dan role

- `AuthProvider` menyimpan access token hanya di memori dan `{ refreshToken, user }` di `localStorage["web-auth"]`. Saat mount, sesi tersimpan dipakai dulu (optimis) lalu diverifikasi: refresh token → `GET /auth/me`; jawaban 4xx mengeluarkan pengguna, galat jaringan membiarkan sesi. Refresh yang datang bersamaan digabung jadi satu request. Pindah ke cookie httpOnly saat backend mendukung.
- API client dapat hook `getToken`/`refresh`/`onUnauthorized` dari `AuthProvider` lewat `setAuthHooks`; 401 → refresh sekali → ulang request; gagal → logout.
- Guard di `features/auth/guards.tsx`: `RequireAuth`, `RedirectIfAuth`, `RequireRole roles={[...]}` (403 → `shared/ForbiddenPage`). Item di `app/shell/nav.ts` boleh punya `roles`; Sidebar, Topbar, dan BottomNav memfilter lewat `visibleNavItems(user)`. Contoh: menu dan route `/app/komponen` hanya untuk `admin`.
- Halaman: `/login`, `/register`, `/lupa-sandi`, `/reset-sandi?token=`, dan `/app/profil` (ubah nama, ganti kata sandi). Semua memakai pola form react-hook-form + zod + `FormField`.

### i18n

- i18next + react-i18next, inisialisasi di `src/app/i18n.ts`, teks di `src/locales/id.json` dan `en.json` (satu namespace, kunci per fitur: `auth.login.title`, `siswa.sheet.added`). Default `id`; bahasa browser diabaikan, pilihan pengguna disimpan di `localStorage["web-lang"]` dan diganti dari Pengaturan. `document.documentElement.lang` dan pesan bawaan zod (`z.locales`) mengikuti bahasa aktif.
- Pesan validasi di schema zod ditulis sebagai kunci (`"validation.emailRequired"`) dan diterjemahkan lewat `useFieldError()` (`src/shared/form.ts`) saat dirender di `FormField`. Pesan dari API ditampilkan apa adanya.
- Item `nav.ts` memakai kunci (`label: "nav.siswa"`); shell merendernya dengan `t(label)`.
- Design system tidak memakai i18next. Teks bawaannya (tutup, memuat, pagination, DataTable, Combobox) diganti sekali lewat `LocaleProvider` di `App.tsx` dari kunci `ds.*`; prop per komponen tetap bisa mengalahkan.
- Tanggal: `src/shared/format.ts` memilih locale `Intl` dari bahasa aktif.
- Yang sengaja tidak diterjemahkan: nama produk di `BrandMark`, data contoh, dan folder demo `features/komponen` (dihapus saat produksi).

### Navigasi

- Shell dashboard berupa panel mengambang: sidebar dan header sticky, versi (dari `package.json`) tampil di bawah sidebar, di header saat horisontal, di dropdown akun, dan di Pengaturan, bottom nav mobile berbentuk pill. Panel memakai resep Card (`rounded-lg border bg-surface shadow-sm`) sehingga ikut skin.
- Orientasi (vertikal/horisontal) dan ciut (ikon saja) diatur di halaman Pengaturan atau tombol di topbar, disimpan di `localStorage["web-layout"]`. Pada orientasi horisontal menu tampil di dalam header, di sebelah nama produk.
- Gaya permukaan (flat/neo/glass/clay/fluid/aurora/swiss) dipilih di Pengaturan (`src/app/skin.tsx`, `localStorage["web-skin"]`), default neo.
- Di bawah `md` (768px) sidebar/topnav disembunyikan dan tujuan tampil di bottom nav berlabel (grup membuka popup ke atas berisi anak-anaknya; lihat bagian menu bersarang untuk batas jumlah item).
- Menu bersarang: `NavNode.children` rekursif, jadi grup boleh lebih dari satu tingkat (anjuran UX maksimal 3). `to` sebuah grup adalah awalan path semua turunannya (dipakai status aktif dan label tab), dan `roles` berlaku di tingkat mana pun (`pruneNav` membuang node yang tersaring dan grup yang jadi kosong). Ikon hanya di tingkat atas.
  - Sidebar terbuka: pohon lipat (`NavTree`), terbuka sejak awal di jalur halaman aktif.
  - Sidebar ciut dan header horizontal: popup dengan submenu bersarang (`NavMenuItems` di atas `DropdownMenuSub*` design system).
  - Banyak menu: nav sidebar di-scroll sendiri (brand dan footer tetap). Header horizontal menampilkan paling banyak 6 item inline; bila lebih, 5 pertama inline dan sisanya di popup "Lainnya" (`INLINE_MAX` di `Topbar.tsx`). Nav header turun ke baris kedua di bawah `lg` (≤4 slot) atau `2xl` (lebih banyak). Bottom nav ponsel menampilkan semua item bila ≤5 (`BAR_MAX` di `BottomNav.tsx`); bila lebih, 4 item pertama dan tombol "Menu" yang membuka Sheet berisi seluruh pohon. Karena itu urutan `navItems` menentukan apa yang tampil lebih dulu di header dan bottom nav.
- Halaman `features/konfigurasi` (hanya admin dan superadmin) dan `features/reporting` masih kerangka tanpa data backend.

### Hasil cek (2026-11-02)

Otomatis: typecheck, lint, vitest (3 file, 10 test), build (menghasilkan `sw.js`, `manifest.webmanifest`). Manual/headless (Playwright pada `vite preview`, skrip di luar repo): guard redirect, login kosong ditolak validasi native, login → dashboard, link ke Siswa, loading/empty/error + "Coba lagi", collapse (240 → 56 px, label `sr-only`, `aria-expanded`, tooltip saat fokus, persist setelah reload), orientasi horisontal, tema gelap, menu user tertutup dengan Escape, Keluar → login, manifest 200 dan service worker ready, 404; viewport 375 px tanpa overflow horizontal di landing, login, dashboard, siswa, bottom nav 4 item tinggi 56 px; konsol bersih. Restyle (2026-11-02, skill design-taste-frontend, dial VARIANCE 5 / MOTION 3 / DENSITY 3): Inter Variable terkonfirmasi dimuat (`document.fonts.check`), nav 64 px satu baris, h1 landing 2 baris, CTA di dalam viewport 1280×800 dan 375×812, hero preview tabel nyata 4 baris, anchor Lihat fitur masuk viewport, login split di desktop dan satu kolom di ponsel, BrandMark di sidebar (hanya logo saat diciutkan), tanpa em dash dan eyebrow (grep), light dan dark discreenshot. Skin neo (2026-11-02): `html[data-skin=neo]` terpasang, Button dan link-tombol memakai bayangan ganda, Input `inset`, background `#e9edf3` light dan `#171c26` dark, saklar di Pengaturan menghapus `data-skin` dan bayangan jadi `none`, bertahan setelah reload; kontras teks semua pasangan AA di light dan dark (border/background 1.2:1 sesuai catatan desain); tanpa overflow 375 px; konsol bersih. Halaman demo komponen: 23 route dirender di 1280 px dan 375 px tanpa error konsol dan tanpa overflow; Dialog buka/Escape, Toast, Select, Combobox, Tabs panah, Pagination, Table kosong/memuat, tautan sebelumnya/berikutnya, slug salah → 404. Delivery Gate anti-slop dijalankan saat pengerjaan (tanpa em dash, emoji, gradien, badge dekoratif, angka karangan; semua kontrol berfungsi; state kosong/memuat/gagal ada). Keterbatasan: audit a11y manual belum dilakukan, ikon PWA placeholder, konten dan data contoh.

## Tooling

Prettier, ESLint (+ `eslint-config-prettier`), husky + lint-staged (pre-commit lint/format file staged, pre-push typecheck), Changesets untuk versi design system, CI GitHub Actions (typecheck, lint, format, test, build, storybook, e2e), Playwright e2e di `apps/web/e2e` (`pnpm e2e`). Detail di `CONTRIBUTING.md`.

## Status

Phase 0–7 dari plan selesai dalam versi minimal, ditambah roadmap boilerplate fase 1–6 (data + form, auth + RBAC, komponen admin, i18n, landing + SEO, tooling). Belum: output CJS. Publish ke npmjs.com disiapkan lewat `publishConfig` dan `.github/workflows/release.yml` (0.2.0 sempat terbit di GitHub Packages; rilis npmjs.com menunggu secret `NPM_TOKEN`). Detail dan deviasi di `docs/design-system/implementation-assessment.md`, laporan akhir di `docs/design-system/final-report.md`.