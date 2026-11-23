import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@wnpcode/design-system";
import { useTranslation } from "react-i18next";
import { useLandingContent } from "../content";

export function Faq() {
  const { t } = useTranslation();
  const { faq } = useLandingContent();
  return (
    <section id="faq" data-reveal className="scroll-mt-20 py-16 lg:py-24 border-t border-border">
      <div className="gap-8 lg:grid-cols-12 grid">
        <h2 className="text-2xl font-semibold tracking-tight lg:col-span-4">{t("landing.faq.title")}</h2>
        <Accordion type="single" collapsible className="lg:col-span-8">
          {faq.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="min-h-11 text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="max-w-prose text-base text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
