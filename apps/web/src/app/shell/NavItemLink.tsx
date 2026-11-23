import { useTranslation } from "react-i18next";
import { NavLink, useMatch } from "react-router";
import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@enterprise/design-system";
import type { NavItem } from "./nav";

type Props = { item: NavItem; collapsed: boolean; tooltipSide: "right" | "left" | "bottom" };

// className NavLink harus string, bukan fungsi: TooltipTrigger asChild menggabungkan className secara string
export function NavItemLink({ item: { to, label, icon: Icon, end }, collapsed, tooltipSide }: Props) {
  const { t } = useTranslation();
  const isActive = useMatch({ path: to, end: end ?? false }) !== null;
  const text = t(label);
  const link = (
    <NavLink
      to={to}
      end={end}
      className={cn(
        "min-h-11 gap-3 px-3 text-sm flex items-center overflow-hidden rounded-md transition-colors hover:bg-muted active:bg-muted",
        isActive && "font-medium bg-primary/10 text-primary hover:bg-primary/10",
      )}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <span className={cn(collapsed && "sr-only")}>{text}</span>
    </NavLink>
  );
  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{text}</TooltipContent>
    </Tooltip>
  );
}
