import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { cn } from "@enterprise/design-system";
import { useAuth } from "../../features/auth";
import { visibleNavItems } from "./nav";

export function BottomNav() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <nav
      aria-label={t("nav.main")}
      className="inset-x-3 bottom-3 md:hidden fixed z-40 flex overflow-hidden rounded-lg border border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-md"
    >
      {visibleNavItems(user).map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn("min-h-14 gap-1 text-xs flex flex-1 flex-col items-center justify-center", isActive && "font-medium text-primary")
          }
        >
          <Icon aria-hidden="true" className="size-5" />
          {t(label)}
        </NavLink>
      ))}
    </nav>
  );
}
