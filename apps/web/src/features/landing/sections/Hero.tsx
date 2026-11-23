import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@wnpcode/design-system";
import { siswaContoh, StatusBadge } from "../../siswa";
import { linkButton } from "../../../shared/linkButton";

// preview nyata dari komponen yang dipakai dashboard, bukan gambar tiruan
function HeroPreview() {
  const { t } = useTranslation();
  const menunggu = siswaContoh.filter((s) => s.status === "Menunggu").slice(0, 4);
  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="gap-4 px-4 py-3 flex items-baseline justify-between border-b border-border">
        <span className="text-sm font-medium">{t("landing.previewTitle")}</span>
        <span className="text-xs text-muted-foreground">{t("common.sampleData")}</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.columns.nama")}</TableHead>
            <TableHead>{t("common.columns.kelas")}</TableHead>
            <TableHead>{t("common.columns.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menunggu.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.nama}</TableCell>
              <TableCell>{s.kelas}</TableCell>
              <TableCell>
                <StatusBadge status={s.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="gap-10 pt-12 lg:grid-cols-12 lg:pt-20 grid items-center">
      <div className="lg:col-span-6">
        <h1 data-hero className="text-4xl font-semibold tracking-tighter md:text-5xl leading-[1.05]">
          {t("landing.heroTitle")}
        </h1>
        <p data-hero className="mt-5 text-lg max-w-[55ch] text-muted-foreground">
          {t("landing.heroText")}
        </p>
        <div data-hero className="mt-8 gap-3 flex flex-wrap">
          <Link to="/login" className={linkButton("primary")}>
            {t("landing.cta")}
          </Link>
          <a href="#fitur" className={linkButton("outline")}>
            {t("landing.seeFeatures")}
          </a>
        </div>
      </div>
      <div data-hero className="lg:col-span-6">
        <HeroPreview />
      </div>
    </section>
  );
}
