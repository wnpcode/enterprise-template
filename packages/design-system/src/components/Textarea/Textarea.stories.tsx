import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../Label";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Kolom teks multibaris berbasis \`<textarea>\` native dengan status \`invalid\`. Pakai untuk isian panjang seperti catatan, deskripsi, atau pesan.

**Import**
\`\`\`tsx
import { Textarea } from "@enterprise/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<textarea>\` native: fokus lewat Tab; Enter membuat baris baru, bukan mengirim form.
- Asosiasikan dengan Label lewat \`id\` dan \`htmlFor\`, atau beri \`aria-label\`.
- \`invalid\` menyetel \`aria-invalid="true"\` dan mengubah border serta cincin fokus menjadi merah; \`aria-invalid\` buatan sendiri tetap dipertahankan bila \`invalid\` tidak diset.
- Hubungkan teks bantuan, penghitung karakter, atau pesan galat dengan \`aria-describedby\`.
- Tinggi minimum 5rem; atur \`rows\` atau \`className\` untuk tinggi lain.
- Dites otomatis dengan axe (dengan label), bukan audit manual.

**Do / Don't**
- Do: selalu pasangkan dengan Label yang terlihat.
- Do: beri tahu batas panjang lewat teks bantuan dan \`maxLength\` bila ada batas nyata.
- Don't: memakai Textarea untuk isian satu baris; pakai Input.
- Don't: memakai \`placeholder\` sebagai satu-satunya petunjuk.`,
      },
    },
  },
  args: { "aria-label": "Contoh textarea" },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { placeholder: "Tulis catatan di sini" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "Tidak bisa diubah" } };

export const Invalid: Story = {
  render: () => (
    <div className="max-w-sm gap-2 flex flex-col">
      <Label htmlFor="note" required>
        Catatan
      </Label>
      <Textarea id="note" invalid aria-describedby="note-error" required />
      <p id="note-error" className="text-sm text-danger">
        Catatan wajib diisi.
      </p>
    </div>
  ),
};
