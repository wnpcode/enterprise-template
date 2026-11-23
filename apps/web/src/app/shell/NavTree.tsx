import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useMatch } from "react-router";
import { cn } from "@wnpcode/design-system";
import type { NavNode } from "./nav";
import { activeClass, indent, rowClass } from "./navStyles";

type TreeProps = { nodes: NavNode[]; depth?: number; onNavigate?: () => void };
type NodeProps = { node: NavNode; depth: number; onNavigate?: () => void };

/** Pohon menu lipat dengan kedalaman bebas (sidebar terbuka dan sheet mobile). `depth` 0 = tingkat teratas (dengan ikon). */
export function NavTree({ nodes, depth = 0, onNavigate }: TreeProps) {
  return (
    <ul className={cn("gap-1 flex flex-col", depth > 0 && "mt-1")}>
      {nodes.map((node) => (
        <li key={node.to}>
          <NavTreeNode node={node} depth={depth} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  );
}

export function NavTreeNode({ node, depth, onNavigate }: NodeProps) {
  return node.children ? (
    <NavTreeGroup node={node} depth={depth} onNavigate={onNavigate} />
  ) : (
    <NavTreeLeaf node={node} depth={depth} onNavigate={onNavigate} />
  );
}

function NavTreeLeaf({ node: { to, label, icon: Icon, end }, depth, onNavigate }: NodeProps) {
  const { t } = useTranslation();
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      style={indent(depth)}
      className={({ isActive }) => cn(rowClass, isActive && activeClass)}
    >
      {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
      {t(label)}
    </NavLink>
  );
}

export function NavTreeGroup({ node: { to, label, icon: Icon, children = [] }, depth, onNavigate }: NodeProps) {
  const { t } = useTranslation();
  const listId = useId();
  const active = useMatch({ path: to, end: false }) !== null;
  // terbuka sejak awal bila halaman aktif ada di dalamnya
  const [open, setOpen] = useState(active);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        style={indent(depth)}
        className={cn(rowClass, "w-full", active && !open && activeClass)}
      >
        {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
        <span className="flex-1 text-left">{t(label)}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 shrink-0 transition-transform motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>
      {open && (
        <div id={listId}>
          <NavTree nodes={children} depth={depth + 1} onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
}
