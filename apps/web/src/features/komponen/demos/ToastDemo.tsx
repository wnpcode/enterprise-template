import { Button, useToast } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <DemoSection title="Variant">
        <p className="text-sm text-muted-foreground">Notifikasi muncul di pojok kanan bawah dan hilang sendiri.</p>
        <div className="gap-3 flex flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast({ title: "Draf tersimpan", description: "Pengumuman libur semester disimpan sebagai draf." })}
          >
            Default
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({ variant: "success", title: "Nilai tersimpan", description: "Nilai ulangan harian kelas X IPA 1 berhasil disimpan." })
            }
          >
            Success
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              toast({ variant: "danger", title: "Absensi gagal dikirim", description: "Periksa koneksi internet lalu coba lagi." })
            }
          >
            Danger
          </Button>
        </div>
      </DemoSection>

      <DemoSection title="Durasi kustom">
        <p className="text-sm text-muted-foreground">
          Secara bawaan toast tampil beberapa detik. Pesan yang perlu dibaca teliti bisa diberi duration lebih panjang.
        </p>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: "Jadwal ujian berubah",
              description: "Ujian Matematika kelas XI IPS 2 dipindah ke Kamis pukul 07.30.",
              duration: 10000,
            })
          }
        >
          Tampil 10 detik
        </Button>
      </DemoSection>
    </div>
  );
}
