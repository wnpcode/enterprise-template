import { Outlet } from "react-router";
import { cn, Container } from "@wnpcode/design-system";
import { useTranslation } from "react-i18next";
import { Seo } from "../../shared/Seo";
import { BottomNav } from "../shell/BottomNav";
import { FLOATING_HEADER_REM, HEADER_REM } from "../shell/chrome";
import { Sidebar } from "../shell/Sidebar";
import { Topbar } from "../shell/Topbar";
import { VisitedTabs } from "../shell/VisitedTabs";
import { useLayoutPrefs, type LayoutPrefs } from "../shell/useLayoutPrefs";

export type LayoutContext = { prefs: LayoutPrefs; update: (patch: Partial<LayoutPrefs>) => void };

export function DashboardLayout() {
  const { t } = useTranslation();
  const [prefs, update] = useLayoutPrefs();
  const context: LayoutContext = { prefs, update };

  const horizontal = prefs.orientation === "horizontal";
  // orientasi horizontal memindahkan menu ke header, jadi header tidak boleh hilang
  const headerVisible = prefs.headerVisible || horizontal;
  const headerFull = headerVisible && prefs.headerSpan === "full";
  const headerFloating = prefs.headerType === "floating";
  const offsetRem = headerFull && prefs.headerType !== "static" ? (headerFloating ? FLOATING_HEADER_REM : HEADER_REM) : 0;

  const header = (
    <Topbar
      collapsed={prefs.collapsed}
      onToggleCollapsed={() => update({ collapsed: !prefs.collapsed })}
      showCollapse
      // nama produk ada di sidebar kecuali header melintang di atasnya
      hideTitleOnDesktop={!horizontal && !headerFull}
      inlineNav={horizontal}
      type={prefs.headerType}
      tone={prefs.headerTone}
      chromeStyle={prefs.headerStyle}
      visible={headerVisible}
    />
  );

  return (
    // pb-24 di pembungkus luar agar konten tidak tertutup pill BottomNav di mobile
    <div className="pb-24 md:pb-0 flex min-h-dvh flex-col">
      <Seo title={t("nav.dashboard")} noindex />
      {headerFull && header}
      <div className={cn("flex flex-1", prefs.sidebarSide === "right" && "md:flex-row-reverse")}>
        {!horizontal && (
          <Sidebar
            collapsed={prefs.collapsed}
            type={prefs.sidebarType}
            side={prefs.sidebarSide}
            tone={prefs.sidebarTone}
            chromeStyle={prefs.sidebarStyle}
            offsetRem={offsetRem}
            showBrand={!headerFull}
            withAccount={!headerVisible}
            onToggleCollapsed={() => update({ collapsed: !prefs.collapsed })}
            flushTop={headerFull && headerFloating}
          />
        )}
        <div className="min-w-0 flex flex-1 flex-col">
          {!headerFull && header}
          <VisitedTabs />
          <main className="flex-1">
            <Container size="lg" className="py-4 md:py-6">
              <Outlet context={context} />
            </Container>
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
