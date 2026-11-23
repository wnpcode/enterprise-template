import { useTranslation } from "react-i18next";
import { Container, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useTheme, type Theme } from "@enterprise/design-system";
import { Link, Outlet } from "react-router";
import { LANGUAGE_NAMES, LANGUAGES, type Language } from "../i18n";
import { LANDING_SECTIONS } from "../../features/landing/content";
import { BrandMark } from "../../shared/BrandMark";
import { linkButton } from "../../shared/linkButton";

const THEMES: Theme[] = ["light", "dark", "system"];
const themeKey: Record<Theme, string> = { light: "settings.themeLight", dark: "settings.themeDark", system: "settings.themeSystem" };

export function LandingLayout() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  return (
    <Container size="lg" className="flex min-h-dvh flex-col">
      <header className="h-16 gap-4 flex items-center justify-between">
        <BrandMark to="/" />
        <nav aria-label={t("nav.main")} className="gap-6 text-sm md:flex hidden">
          {LANDING_SECTIONS.map((id) => (
            <a key={id} href={`/#${id}`} className="min-h-11 inline-flex items-center text-muted-foreground hover:text-foreground">
              {t(`landing.nav.${id}`)}
            </a>
          ))}
        </nav>
        <Link to="/login" className={linkButton("outline")}>
          {t("landing.login")}
        </Link>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="gap-6 py-8 text-sm md:flex-row md:items-end md:justify-between flex flex-col border-t border-border">
        <div className="space-y-3">
          <BrandMark />
          <p className="text-muted-foreground">{t("landing.footer")}</p>
          <nav aria-label={t("nav.main")} className="gap-x-5 gap-y-2 flex flex-wrap">
            {LANDING_SECTIONS.map((id) => (
              <a key={id} href={`/#${id}`} className="min-h-11 inline-flex items-center text-muted-foreground hover:text-foreground">
                {t(`landing.nav.${id}`)}
              </a>
            ))}
            <Link to="/login" className="min-h-11 inline-flex items-center text-muted-foreground hover:text-foreground">
              {t("landing.login")}
            </Link>
          </nav>
        </div>
        <div className="gap-4 flex flex-wrap">
          <div className="space-y-1.5">
            <label htmlFor="footer-bahasa" className="text-xs block text-muted-foreground">
              {t("landing.footerLabels.language")}
            </label>
            <Select value={i18n.resolvedLanguage ?? i18n.language} onValueChange={(v) => i18n.changeLanguage(v as Language)}>
              <SelectTrigger id="footer-bahasa" className="min-h-11 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {LANGUAGE_NAMES[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="footer-tema" className="text-xs block text-muted-foreground">
              {t("landing.footerLabels.theme")}
            </label>
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger id="footer-tema" className="min-h-11 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((th) => (
                  <SelectItem key={th} value={th}>
                    {t(themeKey[th])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </footer>
    </Container>
  );
}
