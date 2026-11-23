import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  tags: ["autodocs"],
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `Tab untuk berpindah antar panel pada konteks yang sama. Sub-komponen: \`Tabs\`, \`TabsList\`, \`TabsTrigger\`, \`TabsContent\`.

**Import**
\`\`\`tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan fokus**
- Daftar tab memakai roving tabindex: Tab memfokuskan tab aktif, Tab berikutnya langsung ke panel.
- ArrowLeft/ArrowRight memindah dan mengaktifkan tab (berputar di ujung); Home/End ke tab pertama/terakhir.
- \`TabsList\` berperan \`tablist\`, \`TabsTrigger\` \`tab\` dengan \`aria-selected\`, \`TabsContent\` \`tabpanel\` yang dikaitkan ke tab-nya. Beri \`aria-label\` pada \`TabsList\`.
- \`TabsTrigger disabled\` dilewati navigasi panah. \`Tabs\` tak di-portal sehingga \`data-brand\` bekerja normal.

**Do / Don't**
- Do: pakai \`defaultValue\` (tak terkontrol) atau \`value\` + \`onValueChange\` (terkontrol).
- Do: Beri label tab pendek dan jelas.
- Don't: jangan pakai Tabs untuk navigasi antar halaman; gunakan tautan.
- Don't: jangan menaruh lebih dari satu baris tab atau menyisipkan konten wajib di tab yang tersembunyi.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="profil" className="w-96">
      <TabsList aria-label="Akun siswa">
        <TabsTrigger value="profil">Profil</TabsTrigger>
        <TabsTrigger value="pengaturan">Pengaturan</TabsTrigger>
        <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
      </TabsList>
      <TabsContent value="profil">
        <p className="text-sm">Ahmad Fauzi, kelas 7B. Wali kelas: Ibu Rahma.</p>
      </TabsContent>
      <TabsContent value="pengaturan">
        <p className="text-sm">Atur notifikasi tagihan dan jadwal penjemputan.</p>
      </TabsContent>
      <TabsContent value="riwayat">
        <p className="text-sm">Pembayaran terakhir: 3 November 2026.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="profil" className="w-96">
      <TabsList aria-label="Akun siswa">
        <TabsTrigger value="profil">Profil</TabsTrigger>
        <TabsTrigger value="pengaturan">Pengaturan</TabsTrigger>
        <TabsTrigger value="riwayat" disabled>
          Riwayat
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profil">
        <p className="text-sm">Ahmad Fauzi, kelas 7B. Wali kelas: Ibu Rahma.</p>
      </TabsContent>
      <TabsContent value="pengaturan">
        <p className="text-sm">Atur notifikasi tagihan dan jadwal penjemputan.</p>
      </TabsContent>
    </Tabs>
  ),
};
