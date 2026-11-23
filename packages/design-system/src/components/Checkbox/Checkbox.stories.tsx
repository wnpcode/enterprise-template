import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  tags: ["autodocs"],
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `Kotak centang berbasis \`<input type="checkbox">\` native dengan status \`invalid\`. Pakai untuk pilihan ya/tidak dalam form atau untuk memilih beberapa opsi sekaligus.

**Import**
\`\`\`tsx
import { Checkbox } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<input type="checkbox">\` native: Tab untuk fokus, Space untuk mengubah status. Prop \`type\` tidak bisa diganti.
- Mendukung \`checked\` + \`onChange\` (terkontrol) atau \`defaultChecked\` (tidak terkontrol); status \`disabled\` tidak bisa diubah.
- Asosiasikan dengan Label lewat \`id\` dan \`htmlFor\` sehingga klik pada teks ikut mengubah status.
- \`invalid\` menyetel \`aria-invalid="true"\` dan menambah outline merah; \`aria-invalid\` buatan sendiri tetap dipertahankan.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: selalu beri Label yang terlihat dan tulis dalam bentuk pernyataan ("Setuju dengan syarat layanan").
- Do: kelompokkan beberapa Checkbox terkait dalam \`<fieldset>\` dengan \`<legend>\`.
- Don't: memakai Checkbox untuk pilihan satu-dari-banyak; pakai Radio.
- Don't: memakai Checkbox untuk aksi yang berlaku seketika; pakai Switch.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => (
    <div className="gap-2 flex items-center">
      <Checkbox id="terms" {...args} />
      <label htmlFor="terms" className="text-sm">
        Saya menyetujui syarat dan ketentuan
      </label>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="gap-2 flex items-center">
      <Checkbox id="terms-invalid" invalid />
      <label htmlFor="terms-invalid" className="text-sm">
        Wajib disetujui
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="gap-2 flex items-center">
      <Checkbox id="terms-disabled" disabled defaultChecked />
      <label htmlFor="terms-disabled" className="text-sm">
        Newsletter (tidak tersedia)
      </label>
    </div>
  ),
};
