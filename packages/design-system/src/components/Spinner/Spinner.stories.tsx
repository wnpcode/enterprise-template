import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Indikator pemuatan berputar berupa \`<svg>\` dengan tiga ukuran (\`sm\`, \`md\`, \`lg\`). Pakai untuk proses singkat dengan durasi tidak pasti; untuk kerangka konten, pakai Skeleton.

**Import**
\`\`\`tsx
import { Spinner } from "@enterprise/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Merender \`role="status"\` dengan \`aria-label\` dari prop \`label\` (default \`"Memuat"\`); isi lebih spesifik bila perlu, mis. \`label="Memuat data siswa"\`.
- Tidak interaktif dan tidak dapat difokus.
- Warna mengikuti \`currentColor\`, jadi menyesuaikan teks di sekitarnya.
- Animasi berputar diperlambat (1,5 detik) bila pengguna memilih \`prefers-reduced-motion\`.
- Di dalam Button \`loading\`, Spinner disembunyikan dari pembaca layar dan status dibawa oleh \`aria-busy\` pada tombol.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: ubah \`label\` agar menjelaskan apa yang dimuat.
- Do: lepas Spinner dari DOM setelah proses selesai.
- Don't: menumpuk banyak Spinner di satu layar; satu per area yang sedang dimuat.
- Don't: memakai Spinner untuk proses yang durasinya diketahui dan perlu progres.`,
      },
    },
  },
  component: Spinner,
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="gap-4 flex items-center text-primary">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
