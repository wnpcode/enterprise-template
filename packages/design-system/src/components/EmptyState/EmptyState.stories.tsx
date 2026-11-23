import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Keadaan kosong untuk daftar, tabel, atau hasil pencarian: judul singkat, penjelasan, dan satu aksi lanjutan.

**Import**
\`\`\`tsx
import { EmptyState } from "@enterprise/design-system";
\`\`\`

**Aksesibilitas**
- Judul berupa teks biasa (bukan heading) agar tidak mengganggu struktur heading halaman; letakkan di bawah heading bagian yang sudah ada.
- Ikon hanya dekorasi: beri \`aria-hidden="true"\`.

**Do / Don't**
- Do: jelaskan kenapa kosong dan apa langkah berikutnya ("Belum ada siswa. Tambah siswa pertama.").
- Don't: memakai ilustrasi besar atau lebih dari satu aksi.`,
      },
    },
  },
  args: { title: "Belum ada siswa", description: "Tambah siswa pertama untuk mulai mengelola pendaftaran." },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = { args: { action: <Button>Tambah siswa</Button> } };

export const SearchResult: Story = {
  args: { title: 'Tidak ada hasil untuk "zahra"', description: "Periksa ejaan atau coba kata lain.", action: undefined },
};
