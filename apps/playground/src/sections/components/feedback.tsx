import { Alert, Button, EmptyState, Skeleton, Spinner } from "@wnpcode/design-system";
import { Demo, Section } from "../../Section";

export function AlertSection() {
  return (
    <Section id="alert" title="Alert" description="Pesan inline yang menetap di dekat konten terkait. Pakai live hanya untuk kegagalan.">
      <div className="max-w-md gap-3 flex flex-col">
        <Alert variant="info" title="Info">
          Jadwal ujian sudah diterbitkan.
        </Alert>
        <Alert variant="success" title="Berhasil">
          Data siswa tersimpan.
        </Alert>
        <Alert variant="warning" title="Perhatian">
          Kuota penyimpanan tersisa 5%.
        </Alert>
        <Alert variant="danger" title="Gagal" live>
          Server tidak merespons. Coba lagi.
        </Alert>
      </div>
    </Section>
  );
}

export function EmptyStateSection() {
  return (
    <Section id="empty-state" title="Empty state" description="Jelaskan kenapa kosong dan apa langkah berikutnya.">
      <Demo label="Dengan aksi" className="block">
        <EmptyState
          title="Belum ada siswa"
          description="Tambah siswa pertama untuk mulai mengelola pendaftaran."
          action={<Button>Tambah siswa</Button>}
        />
      </Demo>
      <Demo label="Hasil pencarian" className="block">
        <EmptyState title='Tidak ada hasil untuk "zahra"' description="Periksa ejaan atau coba kata lain." />
      </Demo>
    </Section>
  );
}

export function SkeletonSection() {
  return (
    <Section id="skeleton" title="Skeleton" description="Placeholder bentuk konten selagi data dimuat.">
      <div className="max-w-md space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </Section>
  );
}

export function SpinnerSection() {
  return (
    <Section id="spinner" title="Spinner" description="Indikator proses singkat. Di dalam Button gunakan prop loading.">
      <Demo label="Ukuran">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </Demo>
    </Section>
  );
}
