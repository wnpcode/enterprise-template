import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";
import { Popover, PopoverContent, PopoverTrigger } from "./index";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  tags: ["autodocs"],
  component: Popover,
  parameters: {
    docs: {
      description: {
        component: `Panel mengambang berisi konten interaktif (filter, form kecil) yang terbuka dari trigger. Sub-komponen: \`Popover\`, \`PopoverTrigger\`, \`PopoverContent\`, \`PopoverAnchor\`.

**Import**
\`\`\`tsx
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan fokus**
- Klik atau Enter/Space pada \`PopoverTrigger\` membuka panel; Escape atau klik di luar menutupnya.
- Saat terbuka, fokus pindah ke dalam konten; saat tutup, fokus kembali ke trigger. Berbeda dari Dialog, panel tidak modal sehingga halaman di luarnya tetap bisa dijangkau.
- Trigger memuat \`aria-expanded\` dan \`aria-controls\`; beri \`aria-label\` pada konten bila tidak ada heading.
- Konten di-portal ke body; \`data-brand\` di subtree tidak menjangkau portal, pasang brand lewat \`ThemeProvider brand\`.

**Do / Don't**
- Do: pakai untuk kontrol ringan seperti filter, dengan tombol terapkan di dalam panel.
- Do: Atur \`align\` dan \`sideOffset\` pada \`PopoverContent\`; default \`align="center"\`, \`sideOffset=4\`.
- Don't: jangan pakai untuk teks penjelas singkat; gunakan Tooltip.
- Don't: jangan pakai untuk konfirmasi yang harus memblokir halaman; gunakan Dialog.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const FilterKelas: Story = {
  render: () => (
    <div className="p-16">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filter</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Filter kelas" className="gap-3 flex flex-col">
          <div className="gap-1.5 flex flex-col">
            <Label htmlFor="kelas">Kelas</Label>
            <Input id="kelas" placeholder="Contoh: X IPA 2" />
          </div>
          <div className="gap-1.5 flex flex-col">
            <Label htmlFor="wali">Wali kelas</Label>
            <Input id="wali" placeholder="Nama wali kelas" />
          </div>
          <Button size="sm">Terapkan</Button>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
