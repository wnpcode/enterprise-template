import { useState, type FormEvent } from "react";
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
  Input,
  Label,
} from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function DialogDemo() {
  const [dihapus, setDihapus] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [tersimpan, setTersimpan] = useState<string | null>(null);

  function handleSimpan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTersimpan(catatan.trim());
    setFormOpen(false);
  }

  return (
    <div className="space-y-8">
      <DemoSection title="Konfirmasi hapus">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="danger">Hapus kelas</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus kelas X IPA 2?</DialogTitle>
              <DialogDescription>
                Data kelas dan penempatan siswa di dalamnya akan dihapus. Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="danger" onClick={() => setDihapus(true)}>
                  Hapus
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {dihapus && (
          <p role="status" className="text-sm">
            Kelas X IPA 2 dihapus
          </p>
        )}
      </DemoSection>

      <DemoSection title="Dialog berisi form">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Tambah catatan wali kelas</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSimpan}>
              <DialogHeader>
                <DialogTitle>Catatan wali kelas</DialogTitle>
                <DialogDescription>Catatan singkat untuk kelas XI IPS 1 semester ini.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 pt-4">
                <Label htmlFor="dialog-catatan">Catatan</Label>
                <Input id="dialog-catatan" required value={catatan} onChange={(e) => setCatatan(e.target.value)} />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {tersimpan && (
          <p role="status" className="text-sm">
            Catatan tersimpan: {tersimpan}
          </p>
        )}
      </DemoSection>
    </div>
  );
}
