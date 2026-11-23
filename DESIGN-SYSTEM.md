# DESIGN-SYSTEM.md — Enterprise Design System

Sumber kebenaran untuk token. `packages/design-system/src/styles/index.css` harus mengikuti nilai di sini.
Prefix variabel sumber: `--ds-*`. Tailwind `@theme inline` memetakan ke `--color-*`, `--radius-*`, dst.

## 1. Primitive tokens

### Warna (hex)

| Scale   | 50      | 100     | 200     | 300     | 400     | 500     | 600     | 700     | 800     | 900     | 950     |
|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|
| blue    | #eff6ff | #dbeafe | #bfdbfe | #93c5fd | #60a5fa | #3b82f6 | #2563eb | #1d4ed8 | #1e40af | #1e3a8a | #172554 |
| slate   | #f8fafc | #f1f5f9 | #e2e8f0 | #cbd5e1 | #94a3b8 | #64748b | #475569 | #334155 | #1e293b | #0f172a | #020617 |
| green   | #f0fdf4 | #dcfce7 | #bbf7d0 | #86efac | #4ade80 | #22c55e | #16a34a | #15803d | #166534 | #14532d | #052e16 |
| amber   | #fffbeb | #fef3c7 | #fde68a | #fcd34d | #fbbf24 | #f59e0b | #d97706 | #b45309 | #92400e | #78350f | #451a03 |
| red     | #fef2f2 | #fee2e2 | #fecaca | #fca5a5 | #f87171 | #ef4444 | #dc2626 | #b91c1c | #991b1b | #7f1d1d | #450a0a |
| sky     | #f0f9ff | #e0f2fe | #bae6fd | #7dd3fc | #38bdf8 | #0ea5e9 | #0284c7 | #0369a1 | #075985 | #0c4a6e | #082f49 |

Putih `#ffffff`. Variabel: `--ds-blue-600`, `--ds-slate-50`, dst.

### Tipografi
- Font: `--ds-font-sans: Inter, ui-sans-serif, system-ui, sans-serif`; `--ds-font-mono: ui-monospace, SFMono-Regular, Menlo, monospace`. Tidak ship font file; consumer memuat Inter sendiri (fallback system-ui).
- Ukuran, line-height, dan weight memakai skala default Tailwind (`text-xs`…`text-4xl`, `font-medium`, dst). Tidak ada variabel `--ds-text-*`/`--ds-weight-*`.

### Spacing (base 4px)
Memakai skala default Tailwind (`p-4` = 16px). Tidak ada variabel `--ds-space-*`.

### Radius
none 0 · sm 4px · md 6px · lg 8px · xl 12px · full 9999px.

### Shadow
- sm: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- md: `0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)`
- lg: `0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)`

### Focus & motion
- Ring: 2px solid `--ds-color-ring`, offset 2px, hanya pada `:focus-visible`.
- Durasi: fast 150ms, normal 200ms, easing `cubic-bezier(0.4, 0, 0.2, 1)`.
- `prefers-reduced-motion: reduce` → durasi 0, animasi pulse/spin dimatikan kecuali Spinner (tetap berputar, lebih lambat 1.5s).

## 2. Semantic tokens

| Token (`--ds-color-*`)  | Light       | Dark        |
|-------------------------|-------------|-------------|
| background              | #ffffff     | slate-950   |
| foreground              | slate-900   | slate-50    |
| surface                 | #ffffff     | slate-900   |
| surface-foreground      | slate-900   | slate-50    |
| surface-elevated        | #ffffff     | slate-900   |
| overlay                 | slate-900/50 | slate-50/50 |
| muted                   | slate-100   | slate-800   |
| muted-foreground        | slate-600   | slate-400   |
| border                  | slate-200   | slate-800   |
| input                   | slate-300   | slate-700   |
| ring                    | blue-600    | blue-400    |
| primary                 | blue-600    | blue-500    |
| primary-foreground      | #ffffff     | slate-950   |
| primary-hover           | blue-700    | blue-400    |
| secondary               | slate-100   | slate-800   |
| secondary-foreground    | slate-900   | slate-50    |
| secondary-hover         | slate-200   | slate-700   |
| success                 | green-700   | green-500   |
| success-foreground      | #ffffff     | slate-950   |
| success-subtle          | green-50    | green-950   |
| success-subtle-fg       | green-800   | green-300   |
| warning                 | amber-700   | amber-500   |
| warning-foreground      | #ffffff     | slate-950   |
| warning-subtle          | amber-50    | amber-950   |
| warning-subtle-fg       | amber-800   | amber-300   |
| danger                  | red-600     | red-500     |
| danger-foreground       | #ffffff     | slate-950   |
| danger-hover            | red-700     | red-400     |
| danger-subtle           | red-50      | red-950     |
| danger-subtle-fg        | red-800     | red-300     |
| info                    | sky-700     | sky-500     |
| info-foreground         | #ffffff     | slate-950   |
| info-subtle             | sky-50      | sky-950     |
| info-subtle-fg          | sky-800     | sky-300     |

Badge memakai pasangan `*-subtle` / `*-subtle-fg`; Button memakai `*` / `*-foreground` / `*-hover`.
Komponen hanya memakai token semantik. Token komponen belum ada. `surface-elevated` dipakai bagian melayang non-modal (Popover, DropdownMenu, SelectContent, daftar Combobox, Toast default); `overlay` dipakai backdrop Dialog.

## 3. Theme & brand

- Skin: `[data-skin="<nama>"]` mengubah perlakuan permukaan tanpa mengubah API komponen, bisa digabung dengan brand. Token yang disediakan untuk skin: `--ds-shadow-raised` dan `--ds-shadow-inset` (default `none`; dipetakan ke utilitas `shadow-raised`/`shadow-inset`). Button non-ghost memakai `shadow-raised` + `active:shadow-inset`; Input, Textarea, SelectTrigger, Combobox, Checkbox, Radio, track Switch, TabsList memakai `shadow-inset`. Skin yang di-ship: `neo` (neumorphism): background = surface = input (`#e9edf3` light, `#171c26` dark), border `#d5dbe5`/`#262d3a`, muted `#dfe4ec`/`#1f2531`, radius md/lg/xl 10/14/18px, `--ds-shadow-sm` = raised (Card, tab aktif, thumb Switch ikut timbul), `--ds-shadow-md` bayangan ganda lebih lebar untuk overlay. Warna teks tidak diubah. Keterbatasan: kontras tepi kontrol (border terhadap background) rendah secara desain; bergantung pada focus ring dan bayangan. Skin `glass` (glassmorphism): kaca 90% transparan. surface `rgb(255 255 255 / 0.1)` / `rgb(255 255 255 / 0.08)`, surface-elevated `rgb(255 255 255 / 0.75)` / `rgb(15 23 42 / 0.8)` (overlay tetap pekat agar terbaca), overlay (backdrop Dialog) `rgb(238 242 255 / 0.6)` / `rgb(11 18 32 / 0.6)` berembun dengan blur 8px, muted `rgb(100 116 139 / 0.18)` / `rgb(148 163 184 / 0.16)` (tint abu agar Skeleton, Badge neutral, dan TabsList tetap terlihat), border `rgb(255 255 255 / 0.7)` / `rgb(255 255 255 / 0.2)`, input `rgb(100 116 139 / 0.4)` / `rgb(148 163 184 / 0.4)`, background `#eef2ff` / `#0b1220` plus tiga `radial-gradient` (shade -200 light / -950 dark agar `muted-foreground` tetap >= 4.5:1 di pusat blob) di `body` dengan `background-attachment: fixed`; radius sama dengan neo; raised/inset tetap `none`; `backdrop-filter: blur(20px) saturate(160%)` lewat selector `[data-skin="glass"] :is(.bg-surface, .bg-surface-elevated)`; shadow sm/md memakai highlight inset 1px + bayangan lembut. Keterbatasan: Input, Textarea, dan tab aktif ikut 10% karena memakai `bg-surface` (bergantung border `input`); kontras teks bergantung latar di balik kaca; `background-attachment: fixed` diabaikan iOS Safari (gradient ikut scroll, blur tetap jalan); blur bergantung nama kelas utilitas. Skin `clay` (claymorphism): background `#eef0fb` / `#1b1d2e`, surface = surface-elevated = input `#f6f7fd` / `#232640`, radius md/lg/xl 14/20/28px, `--ds-shadow-raised` = bayangan luar lembut + inset highlight atas-kiri + inset gelap bawah-kanan (Button, Card, tab aktif ikut menggembung), `--ds-shadow-inset` cekung untuk kontrol input. Skin `fluid` (fluidmorphism): background `#f5f3ff` / `#0f0b24` dengan tiga `radial-gradient` di `body` yang bergeser pelan (`ds-fluid-flow`, 24 s, dimatikan oleh `prefers-reduced-motion: reduce`), surface semi-solid 0.82 / 0.78 tanpa blur, radius 12/20/32px, bayangan berwarna violet. Skin `aurora`: background `#f0fdfa` / `#050816` dengan tiga gradient pita teal/violet/hijau (`background-attachment: fixed`), surface translusen 0.62 (lebih pekat dari glass agar teks tetap terbaca), blur dibagi dengan glass lewat `:is([data-skin="glass"], [data-skin="aurora"])`. Skin `swiss` (International Typographic Style): radius 0, shadow sm/md/lg kosong, border dan input `slate-900` (light) / `slate-100` (dark), latar putih / hitam murni, primary merah `#d0021b` (dark `red-500`), font `Helvetica Neue, Helvetica, Arial`. Keterbatasan clay/fluid/aurora/swiss: aurora dan fluid bergantung pada gradient `body` (kontras teks diukur di titik gradient terpekat); aurora mewarisi keterbatasan glass (blur bergantung nama kelas, `fixed` diabaikan iOS Safari); swiss memakai font sistem tanpa dependensi font; di swiss danger (`red-600`) dan primary sama-sama merah sehingga bedakan lewat label/ikon.
- Selector: `:root, [data-theme="light"]` untuk light, `[data-theme="dark"]` untuk dark. `system` ditangani di JS (ThemeProvider) dengan menulis `data-theme` hasil resolusi; CSS tidak memakai `prefers-color-scheme` agar precedence eksplisit > system konsisten.
- Brand: `[data-brand="<nama>"]` meng-override token semantik saja (minimal `primary`, `primary-foreground`, `primary-hover`, `ring`). Contoh brand yang di-ship: `acme` (primary `#7c3aed`, hover `#6d28d9`, ring `#7c3aed`; dark: primary `#8b5cf6`, hover `#a78bfa`, ring `#a78bfa`).
- Tone (warna chrome sidebar/header): `data-tone="muted|inverse|primary"` dipasang di elemen chrome dan meng-override token semantik hanya di subtree itu (surface, foreground, muted, muted-foreground, border, input, ring, primary, secondary), jadi `bg-surface`, `hover:bg-muted`, `text-muted-foreground`, item aktif `bg-primary/10 text-primary` ikut berubah tanpa mengubah komponen. Tanpa atribut = token tema biasa. `muted`: surface slate-100/800. `inverse`: kebalikan tema (light: slate-900 dengan primary blue-400; dark: slate-100 dengan primary blue-600). `primary`: blue-700 light / blue-900 dark, teks putih, aksi putih. Brand `acme` ikut (ungu). Portal (tooltip, dropdown) berada di luar subtree dan memakai token tema. Kontras teks terukur >= 4.5:1 di semua pasangan (muted-foreground di atas surface dan hover, foreground, primary pada inverse).
- Persist: `localStorage["ds-theme"]` ∈ `light|dark|system` (default `system`). Anti-flash: `themeInitScript` inline di `<head>`.

## 4. Kontras yang wajib dicek (light & dark)
foreground/background · primary-foreground/primary · muted-foreground/background · danger-foreground/danger · success/warning/info-foreground di atas warnanya · `*-subtle-fg`/`*-subtle`. Target 4.5:1 teks normal, 3:1 teks besar/ikon. Hasil dicatat di `docs/design-system/implementation-assessment.md`; yang gagal diperbaiki atau didokumentasikan. Bukan klaim konformansi WCAG.

## 5. Deviasi dari plan
- Palet default netral karena DESIGN-SYSTEM.md asli tidak ada; dibuat 2026-11-02.
- Warning/success/info-foreground di dark memakai slate-950 (bukan putih) untuk kontras pada warna terang.
- Setelah cek kontras (2026-11-02): light success/warning/info naik ke shade 700 (white di atas 600 hanya 3.2–4.1:1); dark primary-foreground dan danger-foreground memakai slate-950 (white di atas blue-500/red-500 hanya 3.7:1).
- `border` dan `input` terhadap `background` sekitar 1.2–1.5:1. Border bersifat dekoratif; batas input tidak memenuhi 3:1 (WCAG 1.4.11) dan diandalkan pada label + focus ring. Dicatat sebagai keterbatasan, belum diubah.
