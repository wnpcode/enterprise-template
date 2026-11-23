import {
  Button,
  FormField,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@wnpcode/design-system";
import { DemoSection } from "../DemoSection";

function Isi() {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Tambah siswa</SheetTitle>
        <SheetDescription>Data bisa diubah lagi dari daftar siswa.</SheetDescription>
      </SheetHeader>
      <FormField id="sheet-nama" label="Nama lengkap" required>
        {(control) => <Input {...control} className="min-h-11" />}
      </FormField>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline" className="min-h-11">
            Batal
          </Button>
        </SheetClose>
        <Button className="min-h-11">Simpan</Button>
      </SheetFooter>
    </>
  );
}

export function SheetDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Dari kanan (form)">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="min-h-11">Buka dari kanan</Button>
          </SheetTrigger>
          <SheetContent>
            <Isi />
          </SheetContent>
        </Sheet>
      </DemoSection>
      <DemoSection title="Dari bawah (ponsel)">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="min-h-11">
              Buka dari bawah
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <Isi />
          </SheetContent>
        </Sheet>
      </DemoSection>
    </div>
  );
}
