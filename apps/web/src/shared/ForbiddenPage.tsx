import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { linkButton } from "./linkButton";

export function ForbiddenPage() {
  const { t } = useTranslation();
  return (
    <div className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("errors.forbiddenTitle")}</h1>
      <p className="mt-4 text-muted-foreground">{t("errors.forbiddenText")}</p>
      <div className="mt-8">
        <Link to="/app" className={linkButton("outline")}>
          {t("common.toDashboard")}
        </Link>
      </div>
    </div>
  );
}
