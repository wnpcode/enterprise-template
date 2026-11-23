import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { linkButton } from "./linkButton";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("errors.notFoundTitle")}</h1>
      <p className="mt-4 text-muted-foreground">{t("errors.notFoundText")}</p>
      <div className="mt-8 gap-3 flex flex-wrap">
        <Link to="/" className={linkButton("outline")}>
          {t("common.toHome")}
        </Link>
        <Link to="/app" className={linkButton("outline")}>
          {t("common.toDashboard")}
        </Link>
      </div>
    </div>
  );
}
