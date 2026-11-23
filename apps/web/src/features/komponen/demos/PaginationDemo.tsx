import { useState } from "react";
import { Pagination } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  const [wide, setWide] = useState(6);
  const [few, setFew] = useState(1);
  const [one, setOne] = useState(1);

  return (
    <div className="space-y-8">
      <DemoSection title="12 halaman, dengan elipsis">
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Halaman {page} dari 12
        </p>
      </DemoSection>

      <DemoSection title="siblingCount 2">
        <p className="text-sm text-muted-foreground">Dua halaman di kiri dan kanan halaman aktif ikut tampil.</p>
        <Pagination page={wide} pageCount={12} siblingCount={2} onPageChange={setWide} label="Navigasi halaman lebar" />
      </DemoSection>

      <DemoSection title="3 halaman, tanpa elipsis">
        <Pagination page={few} pageCount={3} onPageChange={setFew} label="Navigasi tiga halaman" />
      </DemoSection>

      <DemoSection title="1 halaman">
        <p className="text-sm text-muted-foreground">Kedua tombol panah nonaktif karena tidak ada halaman lain.</p>
        <Pagination page={one} pageCount={1} onPageChange={setOne} label="Navigasi satu halaman" />
      </DemoSection>
    </div>
  );
}
