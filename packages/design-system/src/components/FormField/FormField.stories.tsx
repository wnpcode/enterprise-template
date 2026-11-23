import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Components/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Pembungkus satu kolom form: Label, kontrol, hint, dan pesan error dengan \`id\`, \`aria-describedby\`, dan \`aria-invalid\` yang sudah terhubung. Kontrol diberikan lewat render prop agar bisa dipakai dengan Input, Textarea, Select, atau Combobox tanpa FormField tahu jenisnya.

**Import**
\`\`\`tsx
import { FormField, Input } from "@wnp_code/design-system";

<FormField label="Email" required error={errors.email?.message}>
  {(control) => <Input {...control} type="email" {...register("email")} />}
</FormField>
\`\`\`

**Keyboard dan aksesibilitas**
- Label terhubung lewat \`htmlFor\`; klik label memfokuskan kontrol.
- Hint dan error masuk \`aria-describedby\` kontrol, jadi dibacakan saat kontrol difokus.
- Saat \`error\` terisi kontrol mendapat \`aria-invalid="true"\`; Input dan Textarea mewarnai border dari atribut itu.
- Tidak ada \`role="alert"\` pada error agar pembaca layar tidak diinterupsi setiap ketikan; umumkan error ringkasan form di tempat lain bila perlu.

**Do / Don't**
- Do: sebarkan seluruh \`control\` ke elemen kontrol, lalu tambahkan prop lain (\`type\`, \`register\`, \`autoComplete\`).
- Do: beri \`id\` eksplisit bila kontrol dirujuk dari luar (tautan "lompat ke kolom", test).
- Don't: menaruh error sebagai placeholder atau hanya dengan warna.
- Don't: memakai FormField untuk Checkbox tunggal atau grup Radio; label mereka inline.`,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: { label: "Nama lengkap", children: (p) => <Input {...p} placeholder="Contoh: Siti Rahmawati" /> },
};

export const WithHint: Story = {
  args: { label: "Email", required: true, hint: "Pakai email sekolah.", children: (p) => <Input {...p} type="email" /> },
};

export const WithError: Story = {
  args: {
    label: "NISN",
    required: true,
    error: "NISN harus 10 digit.",
    children: (p) => <Input {...p} defaultValue="12345" inputMode="numeric" />,
  },
};

export const WithTextarea: Story = {
  args: { label: "Catatan", hint: "Maksimal 500 karakter.", children: (p) => <Textarea {...p} rows={3} /> },
};
