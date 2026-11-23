import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  tags: ["autodocs"],
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `Sakelar nyala/mati berupa \`<button role="switch">\`. Pakai untuk pengaturan yang berlaku seketika (notifikasi, mode gelap); untuk isian form yang baru berlaku saat dikirim, pakai Checkbox.

**Import**
\`\`\`tsx
import { Switch } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<button>\` dengan \`role="switch"\` dan \`aria-checked\` yang mengikuti status: Tab untuk fokus, Space atau Enter untuk mengubah.
- Tidak terkontrol dengan \`defaultChecked\`, atau terkontrol dengan \`checked\` + \`onCheckedChange(next)\`. Saat terkontrol, status hanya berubah bila induk memperbarui \`checked\`.
- Tidak punya teks sendiri: beri nama lewat \`aria-label\`, atau Label dengan \`htmlFor\` yang cocok dengan \`id\` Switch.
- \`invalid\` menyetel \`aria-invalid="true"\` dan menambah outline merah; \`type\` default \`"button"\`.
- Knob bergeser dengan transisi 150 ms; belum ada penanganan \`prefers-reduced-motion\` khusus.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: tulis label sebagai keadaan yang diatur ("Notifikasi email"), bukan aksinya.
- Do: tampilkan keadaan saat ini di dekat Switch bila maknanya tidak jelas.
- Don't: memakai Switch di form yang butuh tombol Simpan.
- Don't: membiarkan Switch tanpa nama aksesibel.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { "aria-label": "Aktifkan notifikasi email" },
};

function ControlledDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="gap-3 flex items-center">
      <Switch id="autosave" checked={on} onCheckedChange={setOn} />
      <label htmlFor="autosave" className="text-sm">
        Simpan otomatis: {on ? "aktif" : "nonaktif"}
      </label>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

export const Disabled: Story = {
  args: { "aria-label": "Mode pemeliharaan", disabled: true, defaultChecked: true },
};

export const Invalid: Story = {
  args: { "aria-label": "Setujui kebijakan privasi", invalid: true },
};
