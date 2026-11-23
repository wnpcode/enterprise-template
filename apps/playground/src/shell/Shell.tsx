import type { ReactNode } from "react";
import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@enterprise/design-system";
import { chromeClass, toneAttr, type ShellConfig } from "./config";
import { icons } from "./icons";

type NavLinkItemProps = {
  icon: ReactNode;
  label: string;
  collapsed: boolean;
  tooltipSide: "left" | "right";
  active?: boolean;
  href?: string;
  onClick?: () => void;
};

export function NavLinkItem({ icon, label, collapsed, tooltipSide, active, href, onClick }: NavLinkItemProps) {
  const link = (
    <a
      href={href ?? "#app-shell"}
      onClick={onClick ? (e) => (e.preventDefault(), onClick()) : undefined}
      aria-current={active ? "location" : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "h-9 gap-3 px-2.5 text-sm flex items-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
        active && "font-medium bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
        collapsed && "px-0 justify-center",
      )}
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </a>
  );
  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{label}</TooltipContent>
    </Tooltip>
  );
}

type ShellProps = {
  config: ShellConfig;
  onCollapsedChange: (next: boolean) => void;
  title: string;
  navLabel: string;
  nav: (collapsed: boolean) => ReactNode;
  headerContent?: ReactNode;
  /** Tinggi bingkai (mis. "28rem") untuk preview; kosong = halaman penuh mengikuti viewport. */
  frameHeight?: string;
  children: ReactNode;
};

const HEADER_REM = 3.5;
const FLOATING_HEADER_REM = HEADER_REM + 1.5;

export function Shell({ config, onCollapsedChange, title, navLabel, nav, headerContent, frameHeight, children }: ShellProps) {
  const { sidebar: s, header: h } = config;
  const page = !frameHeight;
  const sidebarFloating = s.type === "floating";
  const headerFloating = h.type === "floating";
  const headerFull = h.visible && h.span === "full";
  // judul produk pindah ke sidebar saat header tidak melintang, supaya tidak hilang
  const brandInSidebar = s.visible && !headerFull;
  const brandInHeader = h.visible && !brandInSidebar;
  const headerOffset = headerFull && h.type !== "static" ? (headerFloating ? FLOATING_HEADER_REM : HEADER_REM) : 0;
  const Title = page ? "h1" : "p";
  const Header = page ? "header" : "div";
  const Aside = page ? "aside" : "div";

  const brand = (collapsed: boolean) => (
    <div className="min-w-0 gap-2 flex items-center">
      <span
        aria-hidden="true"
        className="size-8 text-xs font-semibold grid shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        DS
      </span>
      <Title className={cn("text-sm font-semibold tracking-tight truncate", collapsed && "sr-only")}>{title}</Title>
    </div>
  );

  const header = h.visible && (
    <Header
      data-tone={toneAttr(h.style, h.tone)}
      className={cn(
        "min-h-14 gap-x-4 gap-y-2 px-4 py-2 sm:px-6 z-30 flex flex-wrap items-center",
        chromeClass(h.style),
        h.type !== "static" && (page ? "sm:sticky" : "sticky"),
        h.type !== "static" && "top-0",
        headerFloating ? "top-3 m-3 rounded-lg border" : "border-b",
        headerFloating && h.style === "solid" && "shadow-sm",
      )}
    >
      {brandInHeader && brand(false)}
      <div className="gap-x-4 gap-y-2 ml-auto flex flex-wrap items-center">{headerContent}</div>
    </Header>
  );

  const sidebar = s.visible && (
    <div
      className={cn(
        "sticky shrink-0 self-start",
        page ? "lg:block hidden" : "block",
        sidebarFloating && "p-3",
        sidebarFloating && headerFull && headerFloating && "pt-0",
      )}
      style={{ top: `${headerOffset}rem`, height: `calc(${frameHeight ?? "100dvh"} - ${headerOffset}rem)` }}
    >
      <Aside
        data-tone={toneAttr(s.style, s.tone)}
        className={cn(
          "flex h-full flex-col overflow-hidden transition-[width] duration-200 motion-reduce:transition-none",
          s.collapsed ? "w-14" : "w-52",
          chromeClass(s.style),
          sidebarFloating ? "rounded-lg border" : s.side === "left" ? "border-r" : "border-l",
          sidebarFloating && s.style === "solid" && "shadow-sm",
        )}
      >
        {brandInSidebar && <div className="h-14 px-3 flex shrink-0 items-center border-b border-inherit">{brand(s.collapsed)}</div>}
        <nav aria-label={navLabel} className="min-h-0 p-2 flex-1 overflow-y-auto">
          {nav(s.collapsed)}
        </nav>
        <div className="p-2 shrink-0 border-t border-inherit">
          <button
            type="button"
            aria-label={s.collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            aria-expanded={!s.collapsed}
            onClick={() => onCollapsedChange(!s.collapsed)}
            className={cn(
              "h-9 gap-3 px-2.5 text-sm flex w-full items-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
              s.collapsed && "px-0 justify-center",
            )}
          >
            {icons.layout}
            {!s.collapsed && <span>Ciutkan</span>}
          </button>
        </div>
      </Aside>
    </div>
  );

  return (
    <div
      className={cn("flex flex-col", page ? "min-h-dvh" : "relative overflow-y-auto rounded-lg border border-border bg-background")}
      style={frameHeight ? { height: frameHeight } : undefined}
    >
      {headerFull && header}
      <div className={cn("flex flex-1", s.side === "right" && "flex-row-reverse")}>
        {sidebar}
        <div className="min-w-0 flex flex-1 flex-col">
          {!headerFull && header}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
