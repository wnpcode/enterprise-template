import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./Sheet";

const meta: Meta<typeof SheetContent> = {
  title: "Components/Sheet",
  component: SheetContent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Panel samping (atau bawah) modal untuk form buat/ubah tanpa meninggalkan daftar. Di atas Radix Dialog, API sama dengan Dialog plus prop \`side\`.

**Import**
\`\`\`tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@wnp_code/design-system";
\`\`\`

**Keyboard dan aksesibilitas**
- Fokus dikurung di dalam panel; Escape dan klik overlay menutup; fokus kembali ke pemicu.
- Wajib ada \`SheetTitle\`; tambahkan \`SheetDescription\` atau \`aria-describedby={undefined}\` bila tidak ada deskripsi.
- Tombol tutup (X) berlabel "Tutup".

**Do / Don't**
- Do: \`side="right"\` untuk form di desktop, \`side="bottom"\` untuk aksi singkat di ponsel.
- Don't: menumpuk Sheet di atas Dialog, atau memakai Sheet untuk konfirmasi satu kalimat (pakai Dialog).`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof SheetContent>;

const Form = (
  <>
    <SheetHeader>
      <SheetTitle>Tambah siswa</SheetTitle>
      <SheetDescription>Data bisa diubah lagi dari daftar siswa.</SheetDescription>
    </SheetHeader>
    <div className="space-y-2">
      <Label htmlFor="sheet-nama">Nama lengkap</Label>
      <Input id="sheet-nama" />
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline">Batal</Button>
      </SheetClose>
      <Button>Simpan</Button>
    </SheetFooter>
  </>
);

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Buka dari kanan</Button>
      </SheetTrigger>
      <SheetContent>{Form}</SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Buka dari bawah</Button>
      </SheetTrigger>
      <SheetContent side="bottom">{Form}</SheetContent>
    </Sheet>
  ),
};
