import { useState, type FormEvent } from "react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function CardDemo() {
  const [nama, setNama] = useState("");
  const [tersimpan, setTersimpan] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTersimpan(nama.trim());
  }

  function handleBatal() {
    setNama("");
    setTersimpan(null);
  }

  return (
    <div className="space-y-8">
      <DemoSection title="Card lengkap dengan form">
        <Card className="max-w-md">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Tambah kelas</CardTitle>
              <CardDescription>Isi nama kelas yang akan dibuka pada tahun ajaran ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="card-nama-kelas" required>
                Nama kelas
              </Label>
              <Input id="card-nama-kelas" placeholder="Contoh: X IPA 1" required value={nama} onChange={(e) => setNama(e.target.value)} />
              {tersimpan && (
                <p role="status" className="pt-2 text-sm text-foreground">
                  Tersimpan: {tersimpan}
                </p>
              )}
            </CardContent>
            <CardFooter className="gap-2">
              <Button type="submit">Simpan</Button>
              <Button type="button" variant="outline" onClick={handleBatal}>
                Batal
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DemoSection>

      <DemoSection title="Card hanya konten">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-sm">Rapat orang tua kelas XI IPS 2 dijadwalkan Sabtu, 8 November 2026, pukul 08.00 di aula utama.</p>
          </CardContent>
        </Card>
      </DemoSection>
    </div>
  );
}
