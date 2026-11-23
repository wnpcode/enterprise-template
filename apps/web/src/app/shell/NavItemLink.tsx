import { useTranslation } from "react-i18next";
import { NavLink, useMatch } from "react-router";
import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@wnpcode/design-system";
import type { NavItem } from "./nav";
import { NavGroup } from "./NavGroup";
import { activeClass, rowClass } from "./navStyles";

type Props = { item: NavItem; collapsed: boolean; tooltipSide: "right" | "left" | "bottom"; popover?: boolean; short?: boolean };

// className NavLink harus string, bukan fungsi: TooltipTrigger asChild menggabungkan className secara string
function NavLeaf({ item: { to, label, shortLabel, icon: Icon, end }, collapsed, tooltipSide, short }: Props) {
  const { t } = useTranslation();
  const isActive = useMatch({ path: to, end: end ?? false }) !== null;
  const text = t(short ? (shortLabel ?? label) : label);
  const link = (
    <NavLink to={to} end={end} className={cn(rowClass, "shrink-0 whitespace-nowrap", isActive && activeClass)}>
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

/** `popover`: grup tampil sebagai menu popup (header horizontal); sidebar yang diciutkan selalu popup. `short`: pakai `shortLabel` (header horizontal yang sempit). */
export function NavItemLink(props: Props) {
  return props.item.children ? <NavGroup {...props} /> : <NavLeaf {...props} />;
}
