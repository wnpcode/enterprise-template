import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Button } from "../Button";
import { Container, PageHeader, Stack } from "./Layout";

const meta: Meta = {
  title: "Layout",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Tiga blok tata letak halaman: \`Container\` (lebar maksimum dan padding horizontal), \`Stack\` (susunan flex dengan jarak), dan \`PageHeader\` (judul halaman, deskripsi, dan aksi). Pakai untuk menyusun kerangka halaman sebelum menaruh komponen lain.

**Import**
\`\`\`tsx
import { Container, Stack, PageHeader } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- \`Container\` dan \`Stack\` adalah \`<div>\` tanpa role dan tidak dapat difokus; keduanya hanya mengatur tampilan.
- \`Stack\` tidak mengubah urutan DOM, jadi urutan Tab dan baca tetap sama dengan urutan di kode.
- \`PageHeader\` merender \`<header>\` dengan \`title\` sebagai \`<h1>\`, \`description\` sebagai \`<p>\`, dan \`actions\` di sisi kanan pada layar lebar.
- \`Container\`: \`size\` \`sm\`, \`md\`, \`lg\` (default), atau \`full\`. \`Stack\`: \`direction\` (default \`column\`), \`gap\` (1, 2, 3, 4, 6, 8; default 4), \`align\`, \`justify\`, \`wrap\`.
- Dites otomatis dengan axe, bukan audit manual.

**Do / Don't**
- Do: pakai satu \`PageHeader\` per halaman karena \`title\` menjadi \`<h1>\`.
- Do: pakai \`Stack\` untuk jarak antarelemen, bukan margin manual.
- Don't: mengubah urutan visual dengan CSS sehingga berbeda dari urutan DOM.
- Don't: menumpuk \`Container\` di dalam \`Container\`.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function Box({ children }: { children: ReactNode }) {
  return <div className="px-3 py-2 text-sm rounded-md border border-border">{children}</div>;
}

export const ContainerSizes: Story = {
  render: () => (
    <Stack gap={6}>
      {(["sm", "md", "lg", "full"] as const).map((size) => (
        <Container key={size} size={size}>
          <Box>Container ukuran {size}</Box>
        </Container>
      ))}
    </Stack>
  ),
};

export const StackRowAndColumn: Story = {
  render: () => (
    <Stack gap={6}>
      <Stack gap={2}>
        <Box>Kelas 7A</Box>
        <Box>Kelas 7B</Box>
        <Box>Kelas 7C</Box>
      </Stack>
      <Stack direction="row" gap={3} align="center" justify="between" wrap>
        <Box>Hadir: 28</Box>
        <Box>Izin: 2</Box>
        <Box>Sakit: 1</Box>
        <Box>Alpa: 0</Box>
      </Stack>
    </Stack>
  ),
};

export const PageHeaderWithActions: Story = {
  render: () => (
    <Container>
      <PageHeader
        title="Data Siswa"
        description="Kelola data siswa aktif tahun ajaran 2026/2027."
        actions={
          <>
            <Button variant="outline">Ekspor</Button>
            <Button>Tambah Siswa</Button>
          </>
        }
      />
    </Container>
  ),
};
