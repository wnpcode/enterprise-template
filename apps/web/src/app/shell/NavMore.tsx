import { ChevronDown, Ellipsis } from "lucide-react";
import { useTranslation } from "react-i18next";
import { matchPath, useLocation } from "react-router";
import { cn, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@enterprise/design-system";
import type { NavItem } from "./nav";
import { activeClass, rowClass } from "./navStyles";
import { NavMenuItems } from "./NavMenuItems";

/** Popup "Lainnya" di header horizontal untuk item yang tidak diberi tempat inline. */
export function NavMore({ items }: { items: NavItem[] }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const hasActive = items.some((i) => matchPath({ path: i.to, end: i.end ?? false }, pathname) !== null);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={cn(rowClass, "shrink-0 whitespace-nowrap", hasActive && activeClass)}>
          <Ellipsis aria-hidden="true" className="size-5 shrink-0" />
          <span>{t("nav.more")}</span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom">
        <NavMenuItems nodes={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
