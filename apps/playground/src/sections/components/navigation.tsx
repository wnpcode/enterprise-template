import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Pagination,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wnp_code/design-system";
import { Demo, Section } from "../../Section";

export function TabsSection() {
  return (
    <Section id="tabs" title="Tabs" description="Pindah antar tampilan di halaman yang sama.">
      <Tabs defaultValue="profil">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="pengaturan">Pengaturan</TabsTrigger>
          <TabsTrigger value="riwayat" disabled>
            Riwayat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profil">Identitas sekolah, alamat, dan kontak resmi.</TabsContent>
        <TabsContent value="pengaturan">Tahun ajaran aktif dan hak akses operator.</TabsContent>
      </Tabs>
    </Section>
  );
}

export function AccordionSection() {
  return (
    <Section id="accordion" title="Accordion" description="Daftar pertanyaan atau bagian yang bisa dilipat.">
      <Accordion type="single" collapsible>
        <AccordionItem value="biaya">
          <AccordionTrigger>Apakah pendaftaran PPDB berbayar?</AccordionTrigger>
          <AccordionContent>Tidak. Pendaftaran gratis, biaya hanya dikenakan setelah diterima.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="dokumen">
          <AccordionTrigger>Dokumen apa yang harus diunggah?</AccordionTrigger>
          <AccordionContent>Kartu keluarga, akta kelahiran, dan rapor dua semester terakhir.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}

export function BreadcrumbSection() {
  return (
    <Section id="breadcrumb" title="Breadcrumb" description="Jejak lokasi di dalam hierarki, maksimal 3–4 tingkat.">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#breadcrumb">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#breadcrumb">Siswa</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Aisyah Putri</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Section>
  );
}

export function PaginationSection() {
  const [page, setPage] = useState(1);
  const [few, setFew] = useState(1);
  return (
    <Section id="pagination" title="Pagination" description="Navigasi halaman untuk tabel dan daftar.">
      <Demo label="Banyak halaman" className="block">
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
      </Demo>
      <Demo label="Sedikit halaman" className="block">
        <Pagination page={few} pageCount={3} onPageChange={setFew} />
      </Demo>
    </Section>
  );
}
