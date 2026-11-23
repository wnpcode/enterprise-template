import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./index";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  tags: ["autodocs"],
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: `Dialog modal untuk konfirmasi atau form singkat. Sub-komponen: \`Dialog\`, \`DialogTrigger\`, \`DialogContent\`, \`DialogHeader\`, \`DialogTitle\`, \`DialogDescription\`, \`DialogFooter\`, \`DialogClose\`.

**Import**
\`\`\`tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan fokus**
- Klik atau Enter/Space pada \`DialogTrigger\` membuka dialog; Escape atau tombol tutup (X) di pojok menutupnya.
- Saat terbuka, fokus pindah ke dalam konten dan terjebak di sana (Tab berputar); saat tutup, fokus kembali ke trigger.
- \`DialogTitle\` menjadi nama aksesibel dialog dan \`DialogDescription\` deskripsinya; tombol tutup bawaan memakai teks sr-only "Tutup".
- Konten di-portal ke body; \`data-brand\` di subtree tidak menjangkau portal, pasang brand lewat \`ThemeProvider brand\`.
- Pengujian a11y otomatis memakai axe, bukan audit manual.

**Do / Don't**
- Do: selalu sertakan \`DialogTitle\` (dan \`DialogDescription\` bila perlu konteks).
- Do: Gunakan \`DialogClose\` untuk tombol Batal di \`DialogFooter\`.
- Don't: jangan pakai Dialog untuk pesan non-kritis; gunakan Toast.
- Don't: jangan menumpuk dialog di dalam dialog.`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Konfirmasi: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Hapus kelas</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus kelas?</DialogTitle>
          <DialogDescription>Kelas X IPA 2 beserta seluruh jadwal dan nilainya akan dihapus permanen.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="danger">Hapus</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
