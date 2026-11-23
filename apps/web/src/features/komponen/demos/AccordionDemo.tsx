import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function AccordionDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Single, collapsible">
        <p className="text-sm text-muted-foreground">Satu bagian terbuka dalam satu waktu. Klik bagian yang terbuka untuk menutupnya.</p>
        <Accordion type="single" collapsible defaultValue="berkas">
          <AccordionItem value="berkas">
            <AccordionTrigger>Berkas apa saja yang harus disiapkan?</AccordionTrigger>
            <AccordionContent>
              Akta kelahiran, kartu keluarga, rapor semester terakhir, dan pas foto 3x4 berlatar merah. Unggah dalam format PDF atau JPG,
              maksimal 2 MB per berkas.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="jadwal">
            <AccordionTrigger>Kapan berkas saya diverifikasi?</AccordionTrigger>
            <AccordionContent>
              Panitia memverifikasi berkas pada hari kerja, paling lambat tiga hari setelah pendaftaran dikirim. Hasilnya muncul di halaman
              status pendaftaran.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ubah-data">
            <AccordionTrigger>Bagaimana cara mengubah data setelah mengirim?</AccordionTrigger>
            <AccordionContent>
              Data masih bisa diubah selama status pendaftaran Menunggu. Setelah berkas diverifikasi, hubungi panitia lewat bagian tata
              usaha untuk meminta perubahan.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoSection>

      <DemoSection title="Multiple">
        <p className="text-sm text-muted-foreground">Beberapa bagian boleh terbuka bersamaan, berguna untuk membandingkan isi.</p>
        <Accordion type="multiple" defaultValue={["seragam", "buku"]}>
          <AccordionItem value="seragam">
            <AccordionTrigger>Perlengkapan seragam</AccordionTrigger>
            <AccordionContent>Seragam putih abu-abu, seragam olahraga, dan batik sekolah. Ukuran diisi saat daftar ulang.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="buku">
            <AccordionTrigger>Buku pelajaran</AccordionTrigger>
            <AccordionContent>
              Buku paket dipinjamkan perpustakaan selama satu tahun ajaran dan dikembalikan saat kenaikan kelas.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoSection>
    </div>
  );
}
