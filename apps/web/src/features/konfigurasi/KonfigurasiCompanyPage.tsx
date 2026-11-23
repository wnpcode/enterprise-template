import { useTranslation } from "react-i18next";
import { PageHeader } from "@wnp_code/design-system";
import { useAuth } from "../auth";

// shortcut: hanya menampilkan company terpilih; form pengaturan company menunggu kontrak backend
export function KonfigurasiCompanyPage() {
  const { t } = useTranslation();
  const { company } = useAuth();
  return (
    <div className="space-y-6">
      <PageHeader title={t("konfigurasi.title")} description={t("konfigurasi.description")} />
      <dl className="gap-x-8 gap-y-3 text-sm max-w-md grid grid-cols-[auto_1fr]">
        <dt className="text-muted-foreground">{t("konfigurasi.name")}</dt>
        <dd className="font-medium">{company?.name ?? "-"}</dd>
        <dt className="text-muted-foreground">{t("konfigurasi.id")}</dt>
        <dd className="font-medium">{company?.id ?? "-"}</dd>
      </dl>
    </div>
  );
}
