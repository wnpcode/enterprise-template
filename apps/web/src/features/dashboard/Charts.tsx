import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@wnp_code/design-system";
import type { Siswa, SiswaStatus } from "../siswa";

function KelasBarChart({ siswa }: { siswa: Siswa[] }) {
  const { t } = useTranslation();
  const perKelas = new Map<string, number>();
  for (const s of siswa) perKelas.set(s.kelas, (perKelas.get(s.kelas) ?? 0) + 1);
  const rows = [...perKelas].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = Math.max(1, ...rows.map(([, n]) => n));

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>{t("dashboard.charts.kelasTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("dashboard.charts.kelasEmpty")}</p>
        ) : (
          <ul className="space-y-3">
            {rows.map(([kelas, n]) => (
              <li key={kelas} className="gap-3 text-sm grid grid-cols-[5.5rem_1fr_2rem] items-center">
                <span>{kelas}</span>
                <span aria-hidden="true" className="h-3 rounded-sm bg-muted">
                  <span className="block h-full rounded-sm bg-primary" style={{ width: `${(n / max) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

const STATUS_STYLE: Record<SiswaStatus, { stroke: string; swatch: string }> = {
  Aktif: { stroke: "stroke-success", swatch: "bg-success" },
  Menunggu: { stroke: "stroke-warning", swatch: "bg-warning" },
  Ditolak: { stroke: "stroke-danger", swatch: "bg-danger" },
};
const STATUSES = Object.keys(STATUS_STYLE) as SiswaStatus[];
// lingkaran r=15.915 berkeliling 100, jadi panjang busur = persen
const R = 15.915;

function StatusDonut({ siswa }: { siswa: Siswa[] }) {
  const { t } = useTranslation();
  const total = siswa.length;
  const counts = STATUSES.map((status) => {
    const n = siswa.filter((s) => s.status === status).length;
    return { status, n, pct: total ? (n / total) * 100 : 0 };
  });
  const segments = counts.map((c, i) => ({ ...c, start: counts.slice(0, i).reduce((sum, p) => sum + p.pct, 0) }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t("dashboard.charts.statusTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="gap-6 flex flex-wrap items-center">
        <svg viewBox="0 0 42 42" aria-hidden="true" className="size-36 shrink-0">
          <circle cx="21" cy="21" r={R} fill="none" strokeWidth="5" className="stroke-muted" />
          {segments.map(({ status, pct, start }) =>
            pct === 0 ? null : (
              <circle
                key={status}
                cx="21"
                cy="21"
                r={R}
                fill="none"
                strokeWidth="5"
                className={STATUS_STYLE[status].stroke}
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={25 - start}
              />
            ),
          )}
          <text x="21" y="21" textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="600" className="fill-foreground">
            {total}
          </text>
        </svg>
        <ul className="space-y-2 text-sm">
          {segments.map(({ status, n, pct }) => (
            <li key={status} className="gap-2 flex items-center">
              <span aria-hidden="true" className={`size-3 shrink-0 rounded-sm ${STATUS_STYLE[status].swatch}`} />
              <span>{t(`status.${status}`)}</span>
              <span className="text-muted-foreground tabular-nums">
                {n} ({Math.round(pct)}%)
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function Charts({ siswa }: { siswa: Siswa[] }) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="dash-charts" className="space-y-3">
      <h2 id="dash-charts" className="sr-only">
        {t("dashboard.charts.title")}
      </h2>
      <div className="gap-4 lg:grid-cols-5 grid">
        <KelasBarChart siswa={siswa} />
        <StatusDonut siswa={siswa} />
      </div>
    </section>
  );
}
