# @wnp_code/design-system

Komponen React 19 untuk aplikasi admin, dibangun di atas Tailwind CSS v4 dan Radix UI. Satu entry, token tema semantik, mode terang/gelap, dan teks bawaan yang bisa diganti bahasanya.

## Instalasi

```bash
pnpm add @wnp_code/design-system
# atau: npm install @wnp_code/design-system
```

Peer dependency: `react@^19`, `react-dom@^19`. App juga perlu `tailwindcss@^4` (paket ini tidak mengirim CSS Tailwind yang sudah dikompilasi).

## Setup CSS (Tailwind v4)

Di CSS entry app:

```css
@import "tailwindcss";
@import "@wnp_code/design-system/styles.css";
@source "../node_modules/@wnp_code/design-system/dist";
```

`@source` wajib agar utilitas Tailwind yang dipakai komponen ikut di-generate oleh app. Sesuaikan path relatif `node_modules` dengan lokasi file CSS.

## Pemakaian

Bungkus app dengan provider, lalu pakai komponen:

```tsx
import { Button, ThemeProvider, ToastProvider, TooltipProvider, useToast } from "@wnp_code/design-system";

function Simpan() {
  const { toast } = useToast();
  return <Button onClick={() => toast({ title: "Tersimpan" })}>Simpan</Button>;
}

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <Simpan />
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
```

Agar tidak ada kilatan tema saat halaman dimuat, pasang isi `themeInitScript` sebagai skrip inline di `<head>` (sebelum bundel app):

```ts
import { themeInitScript } from "@wnp_code/design-system";
```

## Theming

- `ThemeProvider` menerima `theme` (`light`, `dark`, `system`; disimpan di `localStorage["ds-theme"]`), `brand`, dan `skin`. Hasilnya ditulis sebagai `data-theme`, `data-brand`, `data-skin` pada `<html>`.
- Komponen hanya memakai token semantik (`bg-primary`, `text-muted-foreground`, dan sebagainya). Brand baru cukup menimpa token `--ds-color-*`; API komponen tidak berubah.
- Konten overlay (Dialog, Select, Dropdown, Tooltip, Popover, Toast) di-portal ke `<body>`, jadi `data-brand` yang dipasang di subtree tidak menjangkaunya; pasang brand di `ThemeProvider` atau `<html>`.

## Teks bawaan dan bahasa

Teks komponen (tombol tutup, "Memuat…", paginasi, tabel) bisa diganti lewat `LocaleProvider`:

```tsx
import { LocaleProvider } from "@wnp_code/design-system";

<LocaleProvider value={{ close: "Close", loading: "Loading…" }}>{children}</LocaleProvider>;
```

## Komponen

- Inti: `Button`, `Input`, `Textarea`, `Label`, `FormField`, `Badge`, `Alert`, `Avatar`, `Checkbox`, `Radio`, `Switch`, `Spinner`, `Skeleton`, `Card`, `EmptyState`.
- Overlay dan navigasi: `Dialog`, `Sheet`, `Select`, `Combobox`, `DropdownMenu` (termasuk submenu bertingkat), `Tabs`, `Accordion`, `Tooltip`, `Popover`, `Toast`, `Breadcrumb`.
- Data dan layout: `Table`, `DataTable` (TanStack Table), `Pagination`, serta primitif layout.
- Utilitas: `cn` (gabungan `clsx` dan `tailwind-merge`).

Semua komponen mengekspor tipe props-nya. Impor hanya dari `@wnp_code/design-system` dan `@wnp_code/design-system/styles.css`; jalur lain bukan API publik.

## Catatan

- Hanya ESM. Output CommonJS belum ada.
- Versi mengikuti SemVer; perubahan yang merusak API publik hanya pada versi mayor.
