import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { cn } from "@wnpcode/design-system";
import { flattenNav, navItems } from "./nav";
import { useVisitedTabs } from "./useVisitedTabs";

const labelSources = [...flattenNav(navItems), { to: "/app/profil", label: "account.profile" }];

/** Kunci terjemahan + sisa segmen (mis. slug komponen), atau null bila path tidak dikenal. */
export function tabLabel(path: string): { key: string; suffix: string } | null {
  const match = labelSources
    .filter((s) => (s.to === "/app" ? path === "/app" : path === s.to || path.startsWith(`${s.to}/`)))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return match ? { key: match.label, suffix: decodeURIComponent(path.slice(match.to.length + 1)) } : null;
}

export function VisitedTabs() {
  const { t } = useTranslation();
  const { tabs, activePath, close } = useVisitedTabs();
  const items = tabs.flatMap((tab) => {
    const l = tabLabel(tab.path);
    return l ? [{ ...tab, text: l.suffix ? `${t(l.key)} · ${l.suffix}` : t(l.key) }] : [];
  });
  if (items.length === 0) return null;

  return (
    <nav aria-label={t("nav.tabs")} className="-mb-1 mx-3 mt-2 md:mx-4 overflow-x-auto">
      <ul className="gap-1 flex">
        {items.map(({ path, url, text }) => {
          const active = path === activePath;
          return (
            <li
              key={path}
              className={cn(
                "text-sm flex shrink-0 items-center rounded-md border",
                active ? "font-medium border-border bg-surface text-foreground" : "border-transparent text-muted-foreground hover:bg-muted",
              )}
            >
              <Link to={url} aria-current={active ? "page" : undefined} className="min-h-11 pl-3 pr-1 max-w-48 flex items-center">
                <span className="truncate">{text}</span>
              </Link>
              <button
                type="button"
                aria-label={t("nav.closeTab", { label: text })}
                onClick={() => close(path)}
                className="size-11 flex items-center justify-center rounded-md hover:text-foreground"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
