import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { linkButton } from "../../../shared/linkButton";
import { useLandingContent } from "../content";

export function Harga() {
  const { t } = useTranslation();
  const { plans } = useLandingContent();
  return (
    <section id="harga" data-reveal className="scroll-mt-20 py-16 lg:py-24 border-t border-border">
      <h2 className="text-2xl font-semibold tracking-tight">{t("landing.pricing.title")}</h2>
      <p className="mt-2 max-w-[60ch] text-muted-foreground">{t("landing.pricing.text")}</p>
      <div className="mt-10 md:grid-cols-3 grid gap-px overflow-hidden rounded-lg border border-border bg-border">
        {plans.map((plan) => (
          <article key={plan.id} className="p-6 flex flex-col bg-surface" aria-labelledby={`plan-${plan.id}`}>
            <h3 id={`plan-${plan.id}`} className="text-lg font-semibold">
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.text}</p>
            <p className="mt-6">
              <span className="text-3xl font-semibold tracking-tight">{plan.price ?? t("landing.pricing.contact")}</span>
              {plan.price && <span className="ml-1 text-sm text-muted-foreground">{t("landing.pricing.perYear")}</span>}
            </p>
            <ul className="mt-6 space-y-2 text-sm flex-1">
              {plan.features.map((f) => (
                <li key={f} className="gap-2 flex">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <a href="#kontak" className={linkButton(plan.price ? "outline" : "primary", "mt-8")}>
              {plan.price ? t("landing.pricing.choose") : t("landing.pricing.contact")}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
