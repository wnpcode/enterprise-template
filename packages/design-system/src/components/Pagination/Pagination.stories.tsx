import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  tags: ["autodocs"],
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `Navigasi antar halaman data. Satu komponen \`Pagination\` (terkontrol) dan fungsi \`getPaginationRange\` yang juga diekspor untuk menghitung deret halaman dan elipsis.

**Import**
\`\`\`tsx
import { Pagination, getPaginationRange } from "@enterprise/design-system";
\`\`\`

**Keyboard dan fokus**
- Dirender sebagai \`<nav>\` dengan \`aria-label\` dari prop \`label\` (default "Navigasi halaman").
- Tab berpindah antar tombol native; Enter/Space mengaktifkan. Halaman aktif memakai \`aria-current="page"\`; tombol Sebelumnya/Berikutnya \`disabled\` di ujung.
- \`page\` (mulai 1), \`pageCount\`, dan \`onPageChange\` dikontrol consumer. \`pageCount\` < 1 tidak merender apa pun.
- \`siblingCount\` (default 1) mengatur jumlah halaman di sisi halaman aktif; bila \`pageCount <= 2 * siblingCount + 5\` semua halaman ditampilkan tanpa elipsis (elipsis \`aria-hidden\`).
- \`Pagination\` tak di-portal.

**Do / Don't**
- Do: simpan \`page\` di state atau URL query dan ambil data baru dari \`onPageChange\`.
- Do: Beri \`label\` yang menyebut isi daftar, terutama bila ada lebih dari satu pagination di halaman.
- Don't: jangan memakai Pagination untuk daftar yang muat satu halaman.
- Don't: jangan menghitung rentang halaman sendiri; pakai \`getPaginationRange\`.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

function Demo({ pageCount }: { pageCount: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} label="Daftar siswa" />;
}

export const Default: Story = { render: () => <Demo pageCount={24} /> };

export const FewPages: Story = { render: () => <Demo pageCount={4} /> };
