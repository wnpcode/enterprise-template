import { useTranslation } from "react-i18next";
import { Card } from "@enterprise/design-system";
import type { Siswa, SiswaStatus } from "../siswa";

export function StatCards({ siswa }: { siswa: Siswa[] }) {
  const { t } = useTranslation();
  const total = siswa.length;
  const count = (status: SiswaStatus) => siswa.filter((s) => s.status === status).length;
  const share = (n: number) => t("dashboard.stats.share", { persen: total ? Math.round((n / total) * 100) : 0 });
  const items = [
    { key: "total", label: t("dashboard.stats.total"), value: total, note: t("dashboard.stats.totalNote") },
    { key: "aktif", label: t("dashboard.stats.aktif"), value: count("Aktif"), note: share(count("Aktif")) },
    { key: "menunggu", label: t("dashboard.stats.menunggu"), value: count("Menunggu"), note: share(count("Menunggu")) },
    { key: "ditolak", label: t("dashboard.stats.ditolak"), value: count("Ditolak"), note: share(count("Ditolak")) },
  ];

  return (
    <section aria-labelledby="dash-stats" className="space-y-3">
      <h2 id="dash-stats" className="sr-only">
        {t("dashboard.stats.title")}
      </h2>
      <dl className="gap-4 lg:grid-cols-4 grid grid-cols-2">
        {items.map((item) => (
          <Card key={item.key} className="p-5">
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="mt-2 text-3xl font-semibold tabular-nums">{item.value}</dd>
            <dd className="mt-1 text-sm text-muted-foreground">{item.note}</dd>
          </Card>
        ))}
      </dl>
    </section>
  );
}
