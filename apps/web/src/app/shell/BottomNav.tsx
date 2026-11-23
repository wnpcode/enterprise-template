import { useTranslation } from "react-i18next";
import { Link, matchPath, useLocation } from "react-router";
import { cn, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@enterprise/design-system";
import { useAuth } from "../../features/auth";
import { MobileMenu } from "./MobileMenu";
import { visibleNavItems } from "./nav";
import { NavMenuItems } from "./NavMenuItems";

// lebih dari 5 item tidak terbaca di 375 px: 4 pertama tampil, seluruh pohon ada di tombol Menu
const BAR_MAX = 5;
const itemClass = "min-h-14 min-w-0 gap-1 text-xs flex flex-1 flex-col items-center justify-center";

export function BottomNav() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const all = visibleNavItems(user);
  const overflow = all.length > BAR_MAX;
  const bar = overflow ? all.slice(0, BAR_MAX - 1) : all;
  return (
    <nav
      aria-label={t("nav.main")}
      className="inset-x-3 bottom-3 md:hidden fixed z-40 flex overflow-hidden rounded-lg border border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-md"
    >
      {bar.map(({ to, label, shortLabel, icon: Icon, end, children }) => {
        const active = matchPath({ path: to, end: end ?? false }, pathname) !== null;
        const cls = cn(itemClass, active && "font-medium text-primary");
        const content = (
          <>
            <Icon aria-hidden="true" className="size-5" />
            <span className="max-w-full truncate">{t(shortLabel ?? label)}</span>
          </>
        );
        // grup tidak punya halaman sendiri: menu popup ke atas berisi anak-anaknya
        if (children) {
          return (
            <DropdownMenu key={to}>
              <DropdownMenuTrigger asChild>
                <button type="button" className={cls}>
                  {content}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="center" sideOffset={12}>
                <NavMenuItems nodes={children} />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        return (
          <Link key={to} to={to} aria-current={active ? "page" : undefined} className={cls}>
            {content}
          </Link>
        );
      })}
      {overflow && <MobileMenu items={all} className={itemClass} />}
    </nav>
  );
}
