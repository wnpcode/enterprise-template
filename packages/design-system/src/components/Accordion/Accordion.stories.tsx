import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  tags: ["autodocs"],
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: `Daftar bagian yang bisa dibuka-tutup, cocok untuk FAQ. Sub-komponen: \`Accordion\`, \`AccordionItem\`, \`AccordionTrigger\`, \`AccordionContent\`.

**Import**
\`\`\`tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@enterprise/design-system";
\`\`\`

**Keyboard dan fokus**
- \`Accordion\` wajib diberi \`type="single"\` (bisa \`collapsible\`) atau \`type="multiple"\`.
- Enter/Space pada \`AccordionTrigger\` membuka atau menutup bagian; trigger memuat \`aria-expanded\` dan \`aria-controls\`.
- ArrowDown/ArrowUp memindah fokus antar trigger, Home/End ke trigger pertama/terakhir; Tab berjalan lewat trigger dan elemen interaktif di konten yang terbuka.
- Trigger dibungkus heading (\`AccordionPrimitive.Header\`); \`AccordionItem disabled\` tidak bisa dibuka. \`Accordion\` tak di-portal.

**Do / Don't**
- Do: beri tiap \`AccordionItem\` \`value\` yang unik.
- Do: Gunakan \`type="single" collapsible\` bila hanya satu bagian perlu terbuka.
- Don't: jangan taruh konten yang wajib dibaca semua pengguna di dalam bagian yang tertutup.
- Don't: jangan menumpuk Accordion di dalam Accordion.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Accordion>;

const items = (
  <>
    <AccordionItem value="jadwal">
      <AccordionTrigger>Kapan pendaftaran PPDB dibuka?</AccordionTrigger>
      <AccordionContent>Pendaftaran gelombang pertama dibuka 1 Desember 2026 sampai 31 Januari 2027.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="syarat">
      <AccordionTrigger>Dokumen apa saja yang perlu disiapkan?</AccordionTrigger>
      <AccordionContent>Akta kelahiran, kartu keluarga, rapor terakhir, dan pas foto 3x4.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="biaya">
      <AccordionTrigger>Berapa biaya pendaftaran?</AccordionTrigger>
      <AccordionContent>Biaya pendaftaran Rp 300.000 dan dibayar melalui transfer virtual account.</AccordionContent>
    </AccordionItem>
  </>
);

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="jadwal" className="w-96">
      {items}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["jadwal", "syarat"]} className="w-96">
      {items}
    </Accordion>
  ),
};
