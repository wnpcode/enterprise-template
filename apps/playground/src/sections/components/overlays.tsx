import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from "@enterprise/design-system";
import { Demo, Section } from "../../Section";

export function DialogSection() {
  const { toast } = useToast();
  return (
    <Section id="dialog" title="Dialog" description="Konfirmasi singkat yang memblokir halaman. Untuk form panjang pakai Sheet.">
      <Demo label="Konfirmasi">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="danger">Hapus kelas</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus kelas 7A?</DialogTitle>
              <DialogDescription>Semua data siswa di kelas ini ikut terhapus dan tidak bisa dikembalikan.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Batal</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="danger" onClick={() => toast({ title: "Kelas 7A dihapus", variant: "danger" })}>
                  Hapus
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>
    </Section>
  );
}

function SheetForm() {
  return (
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
}

export function SheetSection() {
  return (
    <Section id="sheet" title="Sheet" description="Panel samping atau bawah untuk form buat/ubah tanpa meninggalkan daftar.">
      <Demo label="Sisi">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Dari kanan</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetForm />
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Dari bawah</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetForm />
          </SheetContent>
        </Sheet>
      </Demo>
    </Section>
  );
}

export function DropdownMenuSection() {
  const { toast } = useToast();
  const [arsip, setArsip] = useState(false);
  return (
    <Section id="dropdown-menu" title="Dropdown menu" description="Aksi per baris atau per objek. Aksi destruktif di bawah pemisah.">
      <Demo label="Aksi baris">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Aksi</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Kelas 7A</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => toast({ title: "Membuka editor" })}>Ubah</DropdownMenuItem>
            <DropdownMenuItem>Duplikat</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked={arsip} onCheckedChange={setArsip}>
              Tampilkan arsip
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>
    </Section>
  );
}

export function PopoverSection() {
  return (
    <Section id="popover" title="Popover" description="Konten kecil yang melayang dari pemicu, misalnya filter.">
      <Demo label="Filter">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Filter</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <Label htmlFor="filter-nama">Nama siswa</Label>
              <Input id="filter-nama" size="sm" placeholder="Cari nama" />
            </div>
          </PopoverContent>
        </Popover>
      </Demo>
    </Section>
  );
}

export function TooltipSection() {
  return (
    <Section id="tooltip" title="Tooltip" description="Keterangan singkat saat hover atau fokus. Jangan simpan informasi penting di sini.">
      <Demo label="Default">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">Info</Button>
          </TooltipTrigger>
          <TooltipContent>Data diperbarui setiap malam.</TooltipContent>
        </Tooltip>
      </Demo>
    </Section>
  );
}

export function ToastSection() {
  const { toast } = useToast();
  return (
    <Section id="toast" title="Toast" description="Notifikasi sementara setelah aksi. Untuk pesan yang menetap pakai Alert.">
      <Demo label="Varian">
        <Button variant="outline" onClick={() => toast({ title: "Draf disimpan" })}>
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast({ title: "Profil tersimpan", description: "Perubahan tampil di halaman publik.", variant: "success" })}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast({ title: "Gagal menyimpan", description: "Coba lagi sebentar lagi.", variant: "danger" })}
        >
          Danger
        </Button>
      </Demo>
    </Section>
  );
}
