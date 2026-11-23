import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Pesan inline yang menetap di halaman, untuk status atau peringatan yang terkait konten di sekitarnya. Untuk notifikasi sementara pakai Toast.

**Import**
\`\`\`tsx
import { Alert } from "@wnp_code/design-system";
\`\`\`

**Aksesibilitas**
- Default \`role="status"\` (dibacakan tanpa menyela). \`live\` mengubahnya jadi \`role="alert"\` untuk kegagalan yang butuh perhatian segera.
- Warna bukan satu-satunya penanda: selalu beri \`title\` atau teks yang menyebut jenis pesannya.

**Do / Don't**
- Do: satu Alert per konteks, di dekat hal yang dibicarakan.
- Don't: memakai \`live\` untuk pesan informatif biasa.`,
      },
    },
  },
  args: { title: "Perhatian", children: "Kuota penyimpanan tersisa 5%." },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="max-w-md gap-3 flex flex-col">
      <Alert variant="info" title="Info">
        Jadwal ujian sudah diterbitkan.
      </Alert>
      <Alert variant="success" title="Berhasil">
        Data siswa tersimpan.
      </Alert>
      <Alert variant="warning" title="Perhatian">
        Kuota penyimpanan tersisa 5%.
      </Alert>
      <Alert variant="danger" title="Gagal" live>
        Server tidak merespons. Coba lagi.
      </Alert>
    </div>
  ),
};
