import { LocaleProvider, ThemeProvider, ToastProvider, TooltipProvider, type LocaleOverride } from "@enterprise/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "../features/auth";
import { AppRoutes } from "./routes";
import { SkinProvider } from "./skin";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } });

// teks bawaan design system mengikuti bahasa app
function DsLocale({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const value = useMemo<LocaleOverride>(
    () => ({
      close: t("ds.close"),
      loading: t("ds.loading"),
      noData: t("ds.noData"),
      noResults: t("ds.noResults"),
      select: t("ds.select"),
      search: t("ds.search"),
      pagination: {
        nav: t("ds.paginationNav"),
        previous: t("ds.previous"),
        next: t("ds.next"),
        previousLabel: t("ds.previousLabel"),
        nextLabel: t("ds.nextLabel"),
        page: (n) => t("ds.page", { n }),
      },
      dataTable: { selectAll: t("ds.selectAll"), selectRow: t("ds.selectRow"), sort: (column) => t("ds.sortBy", { column }) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t berganti bersama i18n.language
    [t, i18n.language],
  );
  return <LocaleProvider value={value}>{children}</LocaleProvider>;
}

export function App() {
  return (
    <SkinProvider>
      {(skin) => (
        <ThemeProvider skin={skin === "flat" ? undefined : skin}>
          <DsLocale>
            <TooltipProvider>
              <ToastProvider>
                <AuthProvider>
                  <QueryClientProvider client={queryClient}>
                    <AppRoutes />
                  </QueryClientProvider>
                </AuthProvider>
              </ToastProvider>
            </TooltipProvider>
          </DsLocale>
        </ThemeProvider>
      )}
    </SkinProvider>
  );
}
