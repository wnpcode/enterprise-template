import { Button, EmptyState } from "@wnpcode/design-system";
import { Users } from "lucide-react";
import { DemoSection } from "../DemoSection";

export function EmptyStateDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Dengan aksi">
        <div className="rounded-lg border border-border">
          <EmptyState
            icon={<Users aria-hidden="true" />}
            title="Belum ada siswa"
            description="Tambah siswa pertama untuk mulai mengelola pendaftaran."
            action={<Button>Tambah siswa</Button>}
          />
        </div>
      </DemoSection>
      <DemoSection title="Hasil pencarian">
        <div className="rounded-lg border border-border">
          <EmptyState title={'Tidak ada hasil untuk "zahra"'} description="Periksa ejaan atau coba kata lain." />
        </div>
      </DemoSection>
    </div>
  );
}
