import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Foto profil bulat dengan fallback inisial (dua kata pertama) saat gambar tidak ada atau gagal dimuat. Di atas Radix Avatar.

**Import**
\`\`\`tsx
import { Avatar } from "@wnpcode/design-system";
\`\`\`

**Aksesibilitas**
- Tanpa \`alt\`, nama dipakai sebagai nama aksesibel (gambar maupun fallback \`role="img"\`).
- Beri \`alt=""\` bila nama sudah tampil di sebelahnya (misal tombol akun di header) agar tidak dibaca dua kali.

**Do / Don't**
- Do: pakai \`size="sm"\` di baris tabel dan header, \`lg\` di halaman profil.
- Don't: memakai Avatar untuk ikon atau logo.`,
      },
    },
  },
  args: { name: "Budi Guru" },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="gap-3 flex items-center">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/80?img=12", name: "Rina Admin" },
};
