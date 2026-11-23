import { PanelLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@wnp_code/design-system";
import { version } from "../../../package.json";
import { useAuth } from "../../features/auth";
import { BrandMark } from "../../shared/BrandMark";
import { AccountMenu } from "./AccountMenu";
import { CompanySwitcher } from "./CompanySwitcher";
import { chromeClass, toneAttr, type ChromeStyle, type Tone } from "./chrome";
import { visibleNavItems } from "./nav";
import { NavItemLink } from "./NavItemLink";

type SidebarProps = {
  collapsed: boolean;
  type?: "full" | "floating";
  side?: "left" | "right";
  tone?: Tone;
  chromeStyle?: ChromeStyle;
  /** Jarak dari atas (rem) saat header melintang menempel di atas sidebar. */
  offsetRem?: number;
  /** false saat header melintang sudah memuat nama produk. */
  showBrand?: boolean;
  /** Menu akun dan tombol ciut pindah ke footer sidebar saat header disembunyikan. */
  withAccount?: boolean;
  onToggleCollapsed?: () => void;
  /** Header melayang di atas sidebar sudah memberi jarak bawah. */
  flushTop?: boolean;
};

export function Sidebar({
  collapsed,
  type = "floating",
  side = "left",
  tone = "default",
  chromeStyle = "solid",
  offsetRem = 0,
  showBrand = true,
  withAccount = false,
  onToggleCollapsed,
  flushTop = false,
}: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const floating = type === "floating";
  const tooltipSide = side === "left" ? "right" : "left";
  return (
    <div
      className={cn(
        "md:sticky md:block hidden shrink-0 self-start",
        floating && "md:p-4",
        floating && (side === "left" ? "md:pr-0" : "md:pl-0"),
        floating && flushTop && "md:pt-0",
      )}
      style={{ top: `${offsetRem}rem`, height: `calc(100dvh - ${offsetRem}rem)` }}
    >
      <aside
        aria-label={t("nav.main")}
        data-tone={toneAttr(chromeStyle, tone)}
        className={cn(
          "flex h-full flex-col overflow-hidden transition-[width] duration-200 motion-reduce:transition-none",
          collapsed ? "w-14" : "w-60",
          chromeClass(chromeStyle),
          floating ? "rounded-lg border" : side === "left" ? "border-r" : "border-l",
          floating && chromeStyle === "solid" && "shadow-sm",
        )}
      >
        {showBrand && (
          <div className="min-h-14 px-3 flex items-center border-b border-inherit">
            <BrandMark collapsed={collapsed} />
          </div>
        )}
        {/* menu yang banyak di-scroll di sini; brand dan footer tetap terlihat */}
        <nav
          className={cn(
            "gap-1 min-h-0 flex flex-1 flex-col overflow-y-auto overscroll-contain",
            collapsed ? "p-1 [scrollbar-width:none]" : "p-2 [scrollbar-width:thin]",
          )}
        >
          {visibleNavItems(user).map((item) => (
            <NavItemLink key={item.to} item={item} collapsed={collapsed} tooltipSide={tooltipSide} />
          ))}
        </nav>
        {withAccount && (
          <div className={cn("gap-1 mt-auto flex flex-col border-t border-inherit", collapsed ? "p-1" : "p-2")}>
            {onToggleCollapsed && (
              <button
                type="button"
                aria-label={collapsed ? t("nav.expand") : t("nav.collapse")}
                aria-expanded={!collapsed}
                onClick={onToggleCollapsed}
                className="min-h-11 px-3 text-sm flex items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <PanelLeft aria-hidden="true" className="size-5" />
              </button>
            )}
            {/* tidak muat di sidebar yang diciutkan (w-14); buka sidebar untuk mengganti company */}
            {!collapsed && <CompanySwitcher />}
            <AccountMenu compact={collapsed} side={tooltipSide} />
          </div>
        )}
        {!collapsed && (
          <p className={cn("px-3 py-2 text-xs border-t border-inherit text-muted-foreground", !withAccount && "mt-auto")}>v{version}</p>
        )}
      </aside>
    </div>
  );
}
