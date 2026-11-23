import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@wnpcode/design-system";
import { DemoSection } from "../DemoSection";

const namaTab: Record<string, string> = { profil: "Profil", nilai: "Nilai", kehadiran: "Kehadiran" };

export function TabsDemo() {
  const [aktif, setAktif] = useState("profil");

  return (
    <div className="space-y-8">
      <DemoSection title="Profil, nilai, kehadiran">
        <Tabs defaultValue="profil">
          <TabsList>
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="nilai">Nilai</TabsTrigger>
            <TabsTrigger value="kehadiran">Kehadiran</TabsTrigger>
          </TabsList>
          <TabsContent value="profil">
            <p className="text-sm">Rizky Pratama, kelas XI IPA 1, wali kelas Bu Dewi Lestari. NISN 0051234567.</p>
          </TabsContent>
          <TabsContent value="nilai">
            <p className="text-sm">Rata-rata nilai semester ganjil 84,5. Nilai tertinggi ada pada Matematika dan Fisika.</p>
          </TabsContent>
          <TabsContent value="kehadiran">
            <p className="text-sm">Hadir 92 dari 96 hari efektif. Izin 2 hari, sakit 1 hari, tanpa keterangan 1 hari.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Terkontrol">
        <Tabs value={aktif} onValueChange={setAktif}>
          <TabsList>
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="nilai">Nilai</TabsTrigger>
            <TabsTrigger value="kehadiran">Kehadiran</TabsTrigger>
          </TabsList>
          <TabsContent value="profil">
            <p className="text-sm">Data diri siswa: nama, kelas, dan kontak wali.</p>
          </TabsContent>
          <TabsContent value="nilai">
            <p className="text-sm">Rekap nilai per mata pelajaran untuk semester berjalan.</p>
          </TabsContent>
          <TabsContent value="kehadiran">
            <p className="text-sm">Rekap kehadiran harian dan keterangan ketidakhadiran.</p>
          </TabsContent>
        </Tabs>
        <p role="status" className="text-sm text-muted-foreground">
          Tab aktif: {namaTab[aktif]}
        </p>
      </DemoSection>
    </div>
  );
}
