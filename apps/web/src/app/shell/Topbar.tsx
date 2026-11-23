import { PanelLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, cn } from "@wnp_code/design-system";
import { version } from "../../../package.json";
import { useAuth } from "../../features/auth";
import { BrandMark } from "../../shared/BrandMark";
import { AccountMenu } from "./AccountMenu";
import { CompanySwitcher } from "./CompanySwitcher";
import { chromeClass, toneAttr, type ChromeStyle, type Tone } from "./chrome";
import { visibleNavItems } from "./nav";
import { NavItemLink } from "./NavItemLink";
import { NavMore } from "./NavMore";

const INLINE_MAX = 6;

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
  const all = visibleNavItems(user);
  // lebih dari INLINE_MAX item tidak muat satu baris: sisanya ke popup "Lainnya"
  const overflow = all.length > INLINE_MAX;
  const items = overflow ? all.slice(0, INLINE_MAX - 1) : all;
  const rest = overflow ? all.slice(INLINE_MAX - 1) : [];
  const slots = items.length + (overflow ? 1 : 0);

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
        // menu turun ke baris kedua di dalam header agar label tidak terpotong: di bawah lg untuk <=4 item,
        // di bawah 2xl untuk lebih banyak item (enam item + pemilih company + akun tidak muat satu baris di 1280)
        <nav
          aria-label={t("nav.main")}
          className={cn(
            "gap-1 md:flex hidden",
            slots > 4
              ? "max-2xl:order-last max-2xl:basis-full max-2xl:border-t max-2xl:border-inherit max-2xl:py-1"
              : "max-lg:order-last max-lg:basis-full max-lg:border-t max-lg:border-inherit max-lg:py-1",
          )}
        >
          {items.map((item) => (
            <NavItemLink key={item.to} item={item} collapsed={collapsed} tooltipSide="bottom" popover short />
          ))}
          {overflow && <NavMore items={rest} />}
        </nav>
      )}
      {/* di bawah md turun ke baris kedua header agar tidak ada overflow horizontal */}
      <CompanySwitcher className="max-md:order-last max-md:basis-full md:ml-auto md:w-48 xl:w-60" />
      <div className="gap-2 md:ml-0 ml-auto flex items-center">
        {inlineNav && <span className="text-xs xl:inline hidden text-muted-foreground">v{version}</span>}
        <AccountMenu />
      </div>
    </header>
  );
}
