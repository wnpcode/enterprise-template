import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Tombol aksi berbasis elemen \`<button>\` native, dengan varian \`primary\`, \`secondary\`, \`outline\`, \`ghost\`, \`danger\`, tiga ukuran, dan status \`loading\`. Pakai untuk aksi di halaman (simpan, kirim, hapus); untuk navigasi pakai tautan.

**Import**
\`\`\`tsx
import { Button } from "@wnpcode/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Elemen \`<button>\` native: dapat difokus dengan Tab, diaktifkan dengan Enter dan Space. Cincin fokus hanya tampil lewat \`:focus-visible\`.
- \`type\` default \`"button"\`, jadi tidak mengirim form tanpa sengaja. Set \`type="submit"\` secara eksplisit untuk tombol kirim.
- \`loading\` menyetel \`aria-busy\`, menonaktifkan tombol, memblokir klik, dan mengganti slot \`leading\` dengan Spinner. Teks \`children\` tetap menjadi nama tombol.
- Slot \`leading\` dan \`trailing\` dibungkus \`aria-hidden\`, sehingga tombol hanya ikon tidak punya nama aksesibel; beri \`aria-label\`.
- Keadaan \`disabled\` memakai atribut native, sehingga tombol tidak bisa difokus dan tidak menerima klik.
- Dites otomatis dengan axe (termasuk saat loading), bukan audit manual.

**Do / Don't**
- Do: pakai satu \`primary\` per area, sisanya \`secondary\`, \`outline\`, atau \`ghost\`.
- Do: pakai \`danger\` hanya untuk aksi destruktif dan beri label yang menyebut akibatnya ("Hapus proyek").
- Don't: membungkus tombol di dalam tautan atau sebaliknya.
- Don't: membuat tombol hanya ikon tanpa \`aria-label\`.`,
      },
    },
  },
  component: Button,
  args: { children: "Button" },
};
export default meta;
type Story = StoryObj<typeof Button>;

const variants = ["primary", "secondary", "outline", "ghost", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="gap-3 flex flex-wrap items-center">
      {variants.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="gap-3 flex flex-wrap items-center">
      {sizes.map((s) => (
        <Button key={s} size={s}>
          {s}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const Loading: Story = { args: { loading: true, children: "Saving" } };

export const WithLeadingAndTrailing: Story = {
  args: { leading: <span>+</span>, trailing: <span>&rarr;</span>, children: "Add item" },
};
