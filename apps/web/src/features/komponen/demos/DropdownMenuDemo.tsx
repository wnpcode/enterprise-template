import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function DropdownMenuDemo() {
  const [aksi, setAksi] = useState<string | null>(null);
  const [tampilNisn, setTampilNisn] = useState(true);
  const [tampilWali, setTampilWali] = useState(false);

  const kolom = [tampilNisn && "NISN", tampilWali && "Wali"].filter(Boolean).join(", ");

  return (
    <div className="space-y-8">
      <DemoSection title="Menu aksi baris siswa">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Aksi untuk Siti Rahmawati</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Siti Rahmawati</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setAksi("Lihat profil Siti Rahmawati")}>Lihat profil</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setAksi("Ubah kelas Siti Rahmawati")}>Ubah kelas</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => setAksi("Hapus Siti Rahmawati")}>
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p role="status" className="text-sm text-muted-foreground">
          {aksi ? `Aksi terakhir: ${aksi}` : "Aksi terakhir: belum ada"}
        </p>
      </DemoSection>

      <DemoSection title="Pilihan kolom tabel">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Kolom</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Tampilkan kolom</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={tampilNisn} onCheckedChange={setTampilNisn}>
              Tampilkan NISN
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={tampilWali} onCheckedChange={setTampilWali}>
              Tampilkan wali
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p role="status" className="text-sm text-muted-foreground">
          Kolom tambahan: {kolom || "tidak ada"}
        </p>
      </DemoSection>
    </div>
  );
}
