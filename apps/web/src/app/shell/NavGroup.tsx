import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMatch } from "react-router";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wnpcode/design-system";
import type { NavItem } from "./nav";
import { activeClass, rowClass } from "./navStyles";
import { NavMenuItems } from "./NavMenuItems";
import { NavTreeGroup } from "./NavTree";

type Props = { item: NavItem; collapsed: boolean; tooltipSide: "right" | "left" | "bottom"; popover?: boolean; short?: boolean };

/** Grup menu: dilipat di sidebar yang terbuka (pohon, semua tingkat), menu popup dengan submenu di sidebar ciut dan header horizontal. */
export function NavGroup({ item, collapsed, tooltipSide, popover = false, short = false }: Props) {
  const { t } = useTranslation();
  const { to, label, shortLabel, icon: Icon, children = [] } = item;
  const active = useMatch({ path: to, end: false }) !== null;
  const text = t(short ? (shortLabel ?? label) : label);

  if (!collapsed && !popover) return <NavTreeGroup node={item} depth={0} />;

  const trigger = (
    <DropdownMenuTrigger asChild>
      <button type="button" className={cn(rowClass, "shrink-0 whitespace-nowrap", active && activeClass)}>
        <Icon aria-hidden="true" className="size-5 shrink-0" />
        <span className={cn(collapsed && "sr-only")}>{text}</span>
        {!collapsed && <ChevronDown aria-hidden="true" className="size-4 shrink-0" />}
      </button>
    </DropdownMenuTrigger>
  );
  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side={tooltipSide}>{text}</TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent align="start" side={popover ? "bottom" : tooltipSide}>
        <NavMenuItems nodes={children} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
