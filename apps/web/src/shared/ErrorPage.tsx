import { Button } from "@enterprise/design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { linkButton } from "./linkButton";

export function ErrorPage({ error }: { error: Error }) {
  const { t } = useTranslation();
  return (
    <div className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("errors.errorTitle")}</h1>
      <p className="mt-4 text-muted-foreground">{t("errors.errorText")}</p>
      {import.meta.env.DEV && <pre className="mt-4 p-4 text-sm overflow-x-auto rounded-md bg-muted">{error.message}</pre>}
      <div className="mt-8 gap-3 flex flex-wrap">
        <Button className="min-h-11" onClick={() => window.location.reload()}>
          {t("common.reload")}
        </Button>
        <Link to="/app" className={linkButton("outline")}>
          {t("common.toDashboard")}
        </Link>
      </div>
    </div>
  );
}
