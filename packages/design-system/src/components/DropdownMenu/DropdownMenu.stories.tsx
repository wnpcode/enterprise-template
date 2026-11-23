import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Menu aksi yang terbuka dari sebuah tombol. Sub-komponen: \`DropdownMenu\`, \`DropdownMenuTrigger\`, \`DropdownMenuContent\`, \`DropdownMenuItem\` (prop \`destructive\`), \`DropdownMenuCheckboxItem\`, \`DropdownMenuLabel\`, \`DropdownMenuSeparator\`, dan submenu bertingkat \`DropdownMenuSub\` + \`DropdownMenuSubTrigger\` + \`DropdownMenuSubContent\`.

**Import**
\`\`\`tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan fokus**
- Enter, Space, atau ArrowDown pada trigger membuka menu dan fokus masuk ke item; Escape menutup dan fokus kembali ke trigger.
- Submenu: ArrowRight pada \`DropdownMenuSubTrigger\` membuka, ArrowLeft menutup submenu dan fokus kembali ke pemicunya; Escape menutup seluruh menu.
- Di dalam menu: ArrowUp/ArrowDown berpindah item, Home/End ke awal/akhir, ketik huruf untuk typeahead, Enter/Space mengaktifkan item.
- Menu memakai peran \`menu\`, item \`menuitem\`, dan \`menuitemcheckbox\` untuk \`DropdownMenuCheckboxItem\`; item \`disabled\` dilewati.
- Konten di-portal ke body; \`data-brand\` di subtree tidak menjangkau portal, pasang brand lewat \`ThemeProvider brand\`.

**Do / Don't**
- Do: gunakan untuk aksi (ubah, arsipkan, hapus), dengan \`onSelect\` pada tiap item.
- Do: Tandai aksi berbahaya dengan \`destructive\` dan pisahkan dengan \`DropdownMenuSeparator\`.
- Don't: jangan pakai untuk memilih nilai form; gunakan \`Select\`.
- Don't: jangan menjalankan penghapusan langsung dari item destruktif tanpa konfirmasi (mis. Dialog) bila datanya tidak bisa dipulihkan.`,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const RowActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Aksi</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Kelas 7A</DropdownMenuLabel>
        <DropdownMenuItem>Ubah</DropdownMenuItem>
        <DropdownMenuItem>Duplikat</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>Tampilkan arsip</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>Hapus</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Submenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Reporting</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Laporan Siswa</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Keuangan</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Tagihan</DropdownMenuItem>
            <DropdownMenuItem>Pembayaran</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
