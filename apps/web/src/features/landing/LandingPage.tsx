import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Seo } from "../../shared/Seo";
import { Faq } from "./sections/Faq";
import { Fitur } from "./sections/Fitur";
import { Harga } from "./sections/Harga";
import { Hero } from "./sections/Hero";
import { Kontak } from "./sections/Kontak";
import { Testimoni } from "./sections/Testimoni";

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero]", { y: 16, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 });
      // tiap section muncul saat masuk viewport; satu selector untuk semua section di bawah hero
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 12,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root}>
      <Seo title={t("seo.landingTitle")} description={t("seo.landingDescription")} />
      <Hero />
      <Fitur />
      <Harga />
      <Testimoni />
      <Faq />
      <Kontak />
    </div>
  );
}
