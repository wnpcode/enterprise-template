import { Avatar } from "@wnpcode/design-system";
import { useTranslation } from "react-i18next";
import { useLandingContent } from "../content";

export function Testimoni() {
  const { t } = useTranslation();
  const { testimonials } = useLandingContent();
  return (
    <section data-reveal className="py-16 lg:py-24 border-t border-border">
      <div className="gap-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{t("landing.testimonials.title")}</h2>
        <span className="text-xs text-muted-foreground">{t("common.sampleData")}</span>
      </div>
      <div className="mt-8 gap-10 md:grid-cols-2 grid">
        {testimonials.map((item) => (
          <figure key={item.name} className="pl-5 border-l-2 border-primary">
            <blockquote className="text-lg leading-snug">{item.quote}</blockquote>
            <figcaption className="mt-4 gap-3 text-sm flex items-center">
              <Avatar name={item.name} size="sm" alt="" />
              <span>
                <span className="font-medium block">{item.name}</span>
                <span className="text-muted-foreground">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
