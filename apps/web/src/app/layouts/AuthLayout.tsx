import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { BrandMark } from "../../shared/BrandMark";

export function AuthLayout() {
  const { t } = useTranslation();
  return (
    <div className="lg:grid-cols-2 grid min-h-dvh">
      <aside className="p-12 lg:flex hidden flex-col justify-between bg-muted">
        <BrandMark to="/" />
        <p className="text-lg max-w-[40ch] text-muted-foreground">{t("auth.aside")}</p>
        <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
      </aside>
      <div className="px-4 py-10 flex flex-col items-center justify-center">
        <div className="max-w-sm w-full">
          <div className="mb-8 lg:hidden">
            <BrandMark to="/" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
