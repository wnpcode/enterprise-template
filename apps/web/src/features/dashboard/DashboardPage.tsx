import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button, PageHeader, Skeleton } from "@wnp_code/design-system";
import { fetchSiswa, siswaKeys } from "../siswa";
import { Charts } from "./Charts";
import { KomponenPreview } from "./KomponenPreview";
import { PendaftaranTable } from "./PendaftaranTable";
import { StatCards } from "./StatCards";

// shortcut: ringkasan dihitung di client dari 100 siswa pertama, ganti endpoint ringkasan saat data besar
const PARAMS = { size: 100 };

export function DashboardPage() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch } = useQuery({ queryKey: siswaKeys.list(PARAMS), queryFn: () => fetchSiswa(PARAMS) });

  return (
    <div className="space-y-8">
      <PageHeader title={t("dashboard.title")} description={t("dashboard.description")} />
      {isError ? (
        <div className="space-y-3">
          <p role="alert">{t("dashboard.loadError")}</p>
          <Button variant="outline" className="min-h-11" onClick={() => refetch()}>
            {t("common.retry")}
          </Button>
        </div>
      ) : isPending ? (
        <div aria-busy="true" className="space-y-4">
          <div className="gap-4 lg:grid-cols-4 grid grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <StatCards siswa={data.items} />
          <Charts siswa={data.items} />
          <PendaftaranTable siswa={data.items} />
        </>
      )}
      <KomponenPreview />
    </div>
  );
}
