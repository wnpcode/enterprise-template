import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@wnp_code/design-system";
import type { NavNode } from "./nav";

/** Isi menu popup dengan kedalaman bebas: leaf jadi item, grup jadi submenu. Dipakai di dalam `DropdownMenuContent`. */
export function NavMenuItems({ nodes }: { nodes: NavNode[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <>
      {nodes.map((n) =>
        n.children ? (
          <DropdownMenuSub key={n.to}>
            <DropdownMenuSubTrigger>{t(n.label)}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <NavMenuItems nodes={n.children} />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : (
          <DropdownMenuItem key={n.to} aria-current={pathname === n.to ? "page" : undefined} onSelect={() => navigate(n.to)}>
            {t(n.label)}
          </DropdownMenuItem>
        ),
      )}
    </>
  );
}
