import { PanelLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, cn } from "@enterprise/design-system";
import { version } from "../../../package.json";
import { useAuth } from "../../features/auth";
import { BrandMark } from "../../shared/BrandMark";
import { AccountMenu } from "./AccountMenu";
import { chromeClass, toneAttr, type ChromeStyle, type Tone } from "./chrome";
import { visibleNavItems } from "./nav";
import { NavItemLink } from "./NavItemLink";

type TopbarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  showCollapse: boolean;
  hideTitleOnDesktop?: boolean;
  inlineNav?: boolean;
  type?: "sticky" | "static" | "floating";
  tone?: Tone;
  chromeStyle?: ChromeStyle;
  /** false menyembunyikan header di md ke atas; di ponsel tetap tampil karena memuat menu akun. */
  visible?: boolean;
};

export function Topbar({
  collapsed,
  onToggleCollapsed,
  showCollapse,
  hideTitleOnDesktop,
  inlineNav,
  type = "floating",
  tone = "default",
  chromeStyle = "solid",
  visible = true,
}: TopbarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const floating = type === "floating";

  return (
    <header
      data-tone={toneAttr(chromeStyle, tone)}
      className={cn(
        "min-h-14 gap-2 px-3 md:px-4 z-30 flex flex-wrap items-center",
        chromeClass(chromeStyle),
        type !== "static" && "top-0 sticky",
        floating ? "top-3 m-3 md:top-4 md:m-4 rounded-lg border" : "border-b",
        floating && chromeStyle === "solid" && "shadow-sm",
        !visible && "md:hidden",
      )}
    >
      {showCollapse && (
        <Button
          variant="ghost"
          size="sm"
          className="size-11 md:inline-flex hidden"
          aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
          aria-expanded={!collapsed}
          onClick={onToggleCollapsed}
        >
          <PanelLeft aria-hidden="true" className="size-5" />
        </Button>
      )}
      <BrandMark className={hideTitleOnDesktop ? "md:hidden" : undefined} />
      {inlineNav && (
        // di bawah lg menu turun ke baris kedua di dalam header agar label tidak terpotong
        <nav
          aria-label={t("nav.main")}
          className="gap-1 max-lg:order-last max-lg:basis-full max-lg:border-t max-lg:border-inherit max-lg:py-1 md:flex hidden"
        >
          {visibleNavItems(user).map((item) => (
            <NavItemLink key={item.to} item={item} collapsed={collapsed} tooltipSide="bottom" />
          ))}
        </nav>
      )}
      <div className="gap-2 ml-auto flex items-center">
        {inlineNav && <span className="text-xs md:inline hidden text-muted-foreground">v{version}</span>}
        <AccountMenu />
      </div>
    </header>
  );
}
