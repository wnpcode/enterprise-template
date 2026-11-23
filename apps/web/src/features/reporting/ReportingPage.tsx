import { useTranslation } from "react-i18next";
import { EmptyState, PageHeader } from "@enterprise/design-system";
import { useAuth } from "../auth";

// shortcut: kerangka halaman laporan tanpa data; isi tabel/ekspor menunggu kontrak backend
export function ReportingPage({ jenis }: { jenis: "siswa" | "pendaftaran" }) {
  const { t } = useTranslation();
  const { company } = useAuth();
  return (
    <div className="space-y-6">
      <PageHeader title={t(`reporting.${jenis}.title`)} description={t(`reporting.${jenis}.description`)} />
      <EmptyState title={t("reporting.emptyTitle")} description={t("reporting.emptyText", { company: company?.name ?? "" })} />
    </div>
  );
}
