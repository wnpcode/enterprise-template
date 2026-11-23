import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Penanda status atau kategori kecil berbasis \`<span>\`, dengan varian \`neutral\`, \`primary\`, \`success\`, \`warning\`, \`danger\`, dan \`info\`. Pakai untuk menandai status entri (Aktif, Tertunda) atau jumlah singkat.

**Import**
\`\`\`tsx
import { Badge } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<span>\` statis: tidak dapat difokus dan tidak punya role atau \`aria-*\` bawaan.
- Makna dibawa oleh teksnya. Jangan hanya mengandalkan warna varian untuk membedakan status.
- Badge tidak interaktif; bila perlu aksi, gunakan Button atau tautan.
- Props \`span\` lain (mis. \`aria-label\`, \`title\`) diteruskan ke elemen.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: pakai kata status yang jelas ("Disetujui", "Ditolak") dengan varian yang selaras.
- Do: batasi teks pada satu atau dua kata.
- Don't: membedakan status hanya lewat warna tanpa teks.
- Don't: memakai Badge sebagai tombol atau tautan.`,
      },
    },
  },
  component: Badge,
  args: { children: "Badge" },
};
export default meta;
type Story = StoryObj<typeof Badge>;

const variants = ["neutral", "primary", "success", "warning", "danger", "info"] as const;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="gap-2 flex flex-wrap items-center">
      {variants.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};
