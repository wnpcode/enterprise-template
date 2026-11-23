import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Blok placeholder berdenyut berupa \`<div>\` untuk menandai bentuk konten yang sedang dimuat. Pakai untuk memuat daftar, kartu, atau teks; untuk proses tanpa bentuk konten jelas, pakai Spinner.

**Import**
\`\`\`tsx
import { Skeleton } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Selalu \`aria-hidden="true"\`: tidak dibaca pembaca layar dan tidak dapat difokus.
- Karena tersembunyi, Skeleton tidak mengumumkan status memuat; sampaikan lewat elemen lain, mis. teks atau Spinner dengan \`label\`.
- Animasi denyut dimatikan bila pengguna memilih \`prefers-reduced-motion\`.
- Ukuran dan bentuk diatur lewat \`className\` (mis. \`h-4 w-40\`, \`rounded-full\`).
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: samakan ukuran Skeleton dengan konten aslinya agar tata letak tidak bergeser.
- Do: ganti Skeleton dengan konten sebenarnya begitu data tiba.
- Don't: memakai Skeleton sebagai satu-satunya penanda status memuat bagi pembaca layar.
- Don't: menampilkan Skeleton tanpa batas bila pemuatan gagal; tampilkan pesan galat.`,
      },
    },
  },
  component: Skeleton,
  args: { className: "h-4 w-48" },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="w-64 gap-3 flex items-center">
      <Skeleton className="size-10 rounded-full" />
      <div className="gap-2 flex flex-1 flex-col">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  ),
};
