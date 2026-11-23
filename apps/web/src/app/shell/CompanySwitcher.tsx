import { useId } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Combobox, cn } from "@enterprise/design-system";
import { useAuth } from "../../features/auth";

/** Pemilih company untuk superadmin; tidak tampil bila hanya ada satu company. */
export function CompanySwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { companies, company, selectCompany } = useAuth();
  const queryClient = useQueryClient();
  const id = useId();
  if (companies.length < 2) return null;

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        {t("account.switchCompany")}
      </label>
      <Combobox
        id={id}
        className="min-h-11"
        options={companies.map((c) => ({ value: String(c.id), label: c.name }))}
        value={company ? String(company.id) : undefined}
        searchPlaceholder={t("account.searchCompany")}
        emptyText={t("account.companyNotFound")}
        onValueChange={(v) => {
          selectCompany(Number(v));
          // data company sebelumnya tidak boleh tampil; semua query dimuat ulang dengan company_id baru
          void queryClient.resetQueries();
        }}
      />
    </div>
  );
}
