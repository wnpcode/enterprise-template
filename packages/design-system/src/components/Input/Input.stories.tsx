import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../Label";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Kolom teks satu baris berbasis \`<input>\` native, dengan tiga ukuran dan status \`invalid\`. Pakai untuk isian pendek seperti nama, email, atau pencarian.

**Import**
\`\`\`tsx
import { Input } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<input>\` native: fokus lewat Tab, atribut \`type\`, \`name\`, \`disabled\`, \`required\`, dan \`aria-*\` diteruskan apa adanya.
- Asosiasikan dengan Label lewat \`id\` pada Input dan \`htmlFor\` pada Label, atau beri \`aria-label\`.
- \`invalid\` menyetel \`aria-invalid="true"\` dan mengubah border serta cincin fokus menjadi merah. Tanpa \`invalid\`, \`aria-invalid\` buatan sendiri tetap dipertahankan.
- Hubungkan pesan bantuan atau galat dengan \`aria-describedby\`; komponen tidak merender teks galat.
- Warna merah saja tidak cukup: sertakan pesan teks yang menjelaskan galatnya.
- Dites otomatis dengan axe (dengan label), bukan audit manual.

**Do / Don't**
- Do: selalu pasangkan dengan Label yang terlihat.
- Do: pakai \`type\` yang sesuai (\`email\`, \`tel\`, \`password\`) agar keyboard mobile dan validasi browser benar.
- Don't: memakai \`placeholder\` sebagai pengganti label.
- Don't: menandai \`invalid\` sebelum pengguna selesai mengisi atau mengirim.`,
      },
    },
  },
  args: { "aria-label": "Contoh input" },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Placeholder: Story = { args: { placeholder: "nama@sekolah.sch.id" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="max-w-sm gap-3 flex flex-col">
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "Tidak bisa diubah" } };

export const Invalid: Story = {
  render: () => (
    <div className="max-w-sm gap-2 flex flex-col">
      <Label htmlFor="email" required>
        Alamat email
      </Label>
      <Input id="email" type="email" invalid defaultValue="budi@" aria-describedby="email-error" required />
      <p id="email-error" className="text-sm text-danger">
        Masukkan alamat email yang valid.
      </p>
    </div>
  ),
};
