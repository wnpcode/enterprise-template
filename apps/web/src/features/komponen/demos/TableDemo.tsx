import { useState } from "react";
import {
  Label,
  Radio,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@wnpcode/design-system";
import { StatusBadge, siswaContoh } from "../../siswa";
import { DemoSection } from "../DemoSection";

const KOLOM = ["Nama", "Kelas", "Status", "Terdaftar"];
const BARIS = siswaContoh.slice(0, 5);
const TAMPILAN = [
  { value: "data", label: "Ada data" },
  { value: "memuat", label: "Memuat" },
  { value: "kosong", label: "Kosong" },
] as const;

type Tampilan = (typeof TAMPILAN)[number]["value"];

const formatTanggal = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

function Header() {
  return (
    <TableHeader>
      <TableRow>
        {KOLOM.map((k) => (
          <TableHead key={k}>{k}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

export function TableDemo() {
  const [tampilan, setTampilan] = useState<Tampilan>("data");

  return (
    <div className="space-y-8">
      <DemoSection title="Tabel dengan caption">
        <Table>
          <TableCaption>Lima siswa terbaru tahun ajaran 2026/2027. Data contoh.</TableCaption>
          <Header />
          <TableBody>
            {BARIS.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.nama}</TableCell>
                <TableCell>{s.kelas}</TableCell>
                <TableCell>
                  <StatusBadge status={s.status} />
                </TableCell>
                <TableCell>{formatTanggal(s.terdaftar)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection title="State memuat dan kosong">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Tampilan data</legend>
          <div className="gap-x-6 gap-y-2 flex flex-wrap">
            {TAMPILAN.map((t) => (
              <div key={t.value} className="min-h-11 gap-2 flex items-center">
                <Radio
                  id={`table-tampilan-${t.value}`}
                  name="table-tampilan"
                  value={t.value}
                  checked={tampilan === t.value}
                  onChange={() => setTampilan(t.value)}
                />
                <Label htmlFor={`table-tampilan-${t.value}`}>{t.label}</Label>
              </div>
            ))}
          </div>
        </fieldset>
        <div aria-busy={tampilan === "memuat"}>
          <Table>
            <Header />
            <TableBody>
              {tampilan === "memuat" ? (
                Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i}>
                    {KOLOM.map((k) => (
                      <TableCell key={k}>
                        <Skeleton className="h-5 min-w-16 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : tampilan === "kosong" ? (
                <TableEmpty colSpan={KOLOM.length}>Belum ada siswa terdaftar.</TableEmpty>
              ) : (
                BARIS.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.nama}</TableCell>
                    <TableCell>{s.kelas}</TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell>{formatTanggal(s.terdaftar)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DemoSection>

      <DemoSection title="Dengan footer">
        <Table>
          <Header />
          <TableBody>
            {BARIS.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.nama}</TableCell>
                <TableCell>{s.kelas}</TableCell>
                <TableCell>
                  <StatusBadge status={s.status} />
                </TableCell>
                <TableCell>{formatTanggal(s.terdaftar)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total siswa</TableCell>
              <TableCell>{BARIS.length} siswa</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </DemoSection>
    </div>
  );
}
