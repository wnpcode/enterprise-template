import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Label teks berbasis \`<label>\` native untuk kontrol form. Pakai di setiap Input, Textarea, Checkbox, Radio, atau Switch agar kontrol punya nama yang terlihat.

**Import**
\`\`\`tsx
import { Label } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<label>\` native: hubungkan lewat \`htmlFor\` yang cocok dengan \`id\` kontrol; klik pada label memindahkan fokus atau mengaktifkan kontrolnya.
- \`required\` hanya penanda visual (tanda \`*\` merah). Tanda itu \`aria-hidden\` dan tidak masuk nama aksesibel.
- Atribut \`required\` tetap harus dipasang di kontrolnya agar pembaca layar dan validasi browser tahu.
- Label bukan elemen fokus; tidak ada interaksi keyboard sendiri.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: pakai teks label yang singkat dan spesifik ("Alamat email").
- Do: pasang \`required\` di Label dan di kontrol sekaligus.
- Don't: mengandalkan \`required\` pada Label saja.
- Don't: memakai Label tanpa \`htmlFor\` atau tanpa membungkus kontrolnya.`,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = { args: { children: "Nama lengkap" } };

export const Required: Story = { args: { children: "Alamat email", required: true } };
