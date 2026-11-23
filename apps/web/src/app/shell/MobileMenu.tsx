import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@enterprise/design-system";
import type { NavItem } from "./nav";
import { NavTree } from "./NavTree";

/** Tombol "Menu" di bottom nav: Sheet dari bawah berisi seluruh pohon menu (semua tingkat). */
export function MobileMenu({ items, className }: { items: NavItem[]; className: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className={className}>
          <Menu aria-hidden="true" className="size-5" />
          <span className="max-w-full truncate">{t("nav.menu")}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("nav.menuTitle")}</SheetTitle>
          <SheetDescription className="sr-only">{t("nav.menuDescription")}</SheetDescription>
        </SheetHeader>
        <nav aria-label={t("nav.menuTitle")}>
          <NavTree nodes={items} onNavigate={() => setOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
