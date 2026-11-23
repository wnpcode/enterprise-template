# Kontribusi ke `@wnp_code/design-system`

## Prasyarat

Node 20+, pnpm 10 (`corepack enable`). Dari root: `pnpm install`, lalu `pnpm storybook` atau `pnpm dev` (playground).

## Menambah atau mengubah komponen

Satu komponen = satu folder `packages/design-system/src/components/<Name>/` berisi `<Name>.tsx`, `<Name>.test.tsx`, `<Name>.stories.tsx`, `index.ts`, lalu export dari `src/index.ts`.

Checklist sebelum PR:

- [ ] Props publik bertipe, tanpa `any`; menerima atribut native dan `className`; `ref` sebagai prop (React 19).
- [ ] Hanya token semantik (`bg-primary`, `text-muted-foreground`, …). Token baru masuk `DESIGN-SYSTEM.md` dan `src/styles/index.css` dalam PR yang sama.
- [ ] Interaksi kompleks memakai Radix UI yang sudah terpasang, bukan dibangun ulang.
- [ ] Test perilaku (keyboard, disabled/invalid/loading, asosiasi label) + `expectNoA11yViolations`. Axe adalah cek otomatis, bukan bukti kepatuhan WCAG.
- [ ] Story untuk semua variant dan state publik, plus `parameters.docs.description.component` (tujuan, import, keyboard, Do/Don't).
- [ ] Tidak ada logika bisnis atau data fetching di package.
- [ ] Baris di `CHANGELOG.md` bagian Unreleased dan satu file changeset (`pnpm changeset`, pilih `@wnp_code/design-system`, minor untuk fitur, patch untuk perbaikan).
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm build-storybook` lolos dari root.

## Review API publik

Perubahan pada nama export, prop, nilai `variant`/`size`, nama token, atau path CSS adalah perubahan API publik dan wajib direview untuk kompatibilitas mundur. Tambah prop opsional = minor. Hapus/rename/ubah default yang terlihat = major, lewat deprecation dulu.

## Deprecation

1. Tandai dengan JSDoc `@deprecated <alasan, pengganti>` pada export atau prop; export lama tetap berfungsi.
2. Catat di CHANGELOG bagian **Deprecated** pada rilis minor berikutnya.
3. Hapus paling cepat satu rilis minor setelahnya, dicatat di **Removed**, dan menaikkan versi major.

## Versioning dan rilis

SemVer: major untuk breaking change, minor untuk fitur kompatibel, patch untuk perbaikan. Versi dinaikkan lewat Changesets (`.changeset/`); app `web` dan `playground` diabaikan dari versioning.

```bash
pnpm changeset                 # saat mengerjakan perubahan: tulis file changeset
pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm build-storybook
cd packages/design-system && pnpm pack --dry-run   # harus hanya berisi dist/** dan package.json
```

Rilis berjalan otomatis lewat `.github/workflows/release.yml` ke npmjs.com (`@wnp_code/design-system`, publik; tanpa provenance selama repo private):

1. Merge perubahan beserta file changeset ke `main`. Workflow membuka (atau memperbarui) PR "release: versi baru @wnp_code/design-system" yang menjalankan `pnpm release:version` (naik versi + CHANGELOG).
2. Merge PR itu: workflow menjalankan `pnpm release:publish` (build lalu `changeset publish`) dan membuat tag git.
3. Prasyarat sekali jalan: di repo GitHub aktifkan Settings > Actions > General > "Allow GitHub Actions to create and approve pull requests". Publish memakai secret repo `NPM_TOKEN` (npm granular token dengan izin publish untuk `@wnp_code/*`, organisasi `wnpcode` harus ada di npmjs.com); PR memakai `GITHUB_TOKEN` bawaan.

Rilis manual dari mesin lokal (darurat): `pnpm release:version`, commit, lalu `NODE_AUTH_TOKEN=<npm token> pnpm release:publish`.

`changeset status` butuh branch dasar (`baseBranch` di `.changeset/config.json`, default `main`) yang sudah ada di git.

## Tooling repo

- Prettier (`.prettierrc`, printWidth 140, plugin Tailwind): `pnpm format` atau `pnpm format:check`. ESLint memakai `eslint-config-prettier` agar tidak bentrok.
- husky + lint-staged: pre-commit menjalankan `eslint --fix` dan `prettier --write` pada file yang di-stage; pre-push menjalankan `pnpm typecheck`. Hook terpasang otomatis lewat script `prepare` saat `pnpm install`.
- CI (`.github/workflows/ci.yml`): typecheck, lint, format:check, test, build, build-storybook (artefak), dan job e2e Playwright terpisah.
- E2E: `pnpm e2e` (Playwright, `apps/web/e2e/`, dev server + MSW otomatis, project desktop dan mobile). Pertama kali: `pnpm --filter web exec playwright install chromium`.

Consumer di luar workspace: pasang dari tarball atau registry, lalu ikuti bagian "Memakai package di app lain" di `README.md`. Peer dependency: `react` dan `react-dom` ^19.

## Kepemilikan

Package ini dimiliki tim frontend platform. Setiap komponen baru butuh satu reviewer dari tim tersebut untuk API dan satu untuk aksesibilitas (bisa orang yang sama).
