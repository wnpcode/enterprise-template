import { useTranslation } from "react-i18next";

const FITUR = ["dashboard", "siswa", "komponen", "pengaturan"] as const;

export function Fitur() {
  const { t } = useTranslation();
  return (
    <section id="fitur" data-reveal className="scroll-mt-20 py-16 lg:py-24">
      <h2 className="text-2xl font-semibold tracking-tight">{t("landing.featuresTitle")}</h2>
      <dl className="mt-8 gap-x-10 gap-y-8 sm:grid-cols-2 grid">
        {FITUR.map((key) => (
          <div key={key} className="pt-4 border-t border-border">
            <dt className="font-medium">{t(`nav.${key}`)}</dt>
            <dd className="mt-1 text-muted-foreground">{t(`landing.features.${key}`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
