import { useTranslation } from "react-i18next";

export type Plan = { id: string; name: string; price: string | null; text: string; features: string[] };
export type Testimonial = { quote: string; name: string; role: string };
export type FaqItem = { q: string; a: string };

/** Konten landing (paket, testimoni, FAQ) ada di src/locales/<lang>.json; ganti di sana untuk proyek baru. */
export function useLandingContent() {
  const { t } = useTranslation();
  return {
    plans: t("landing.pricing.plans", { returnObjects: true }) as Plan[],
    testimonials: t("landing.testimonials.items", { returnObjects: true }) as Testimonial[],
    faq: t("landing.faq.items", { returnObjects: true }) as FaqItem[],
  };
}

export const LANDING_SECTIONS = ["fitur", "harga", "faq", "kontak"] as const;
