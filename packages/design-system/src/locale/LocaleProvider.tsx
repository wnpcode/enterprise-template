import { createContext, useContext, useMemo, type ReactNode } from "react";

/** Teks bawaan komponen yang bisa diganti sekali di root app (untuk i18n). */
export type DsLocale = {
  close: string;
  loading: string;
  noData: string;
  noResults: string;
  select: string;
  search: string;
  pagination: {
    nav: string;
    previous: string;
    next: string;
    previousLabel: string;
    nextLabel: string;
    page: (n: number) => string;
  };
  dataTable: {
    selectAll: string;
    selectRow: string;
    sort: (column: string) => string;
  };
  tour: {
    next: string;
    previous: string;
    skip: string;
    skipGroup: string;
    done: string;
    progress: (current: number, total: number) => string;
  };
};

export const defaultLocale: DsLocale = {
  close: "Tutup",
  loading: "Memuat",
  noData: "Tidak ada data",
  noResults: "Tidak ada hasil",
  select: "Pilih…",
  search: "Cari…",
  pagination: {
    nav: "Navigasi halaman",
    previous: "Sebelumnya",
    next: "Berikutnya",
    previousLabel: "Halaman sebelumnya",
    nextLabel: "Halaman berikutnya",
    page: (n) => `Halaman ${n}`,
  },
  dataTable: {
    selectAll: "Pilih semua baris",
    selectRow: "Pilih baris",
    sort: (column) => `Urutkan menurut ${column}`,
  },
  tour: {
    next: "Berikutnya",
    previous: "Sebelumnya",
    skip: "Lewati",
    skipGroup: "Lewati fitur ini",
    done: "Selesai",
    progress: (current, total) => `Langkah ${current} dari ${total}`,
  },
};

export type LocaleOverride = Partial<Omit<DsLocale, "pagination" | "dataTable" | "tour">> & {
  pagination?: Partial<DsLocale["pagination"]>;
  dataTable?: Partial<DsLocale["dataTable"]>;
  tour?: Partial<DsLocale["tour"]>;
};

const LocaleContext = createContext<DsLocale>(defaultLocale);

export function LocaleProvider({ value, children }: { value: LocaleOverride; children: ReactNode }) {
  const merged = useMemo<DsLocale>(
    () => ({
      ...defaultLocale,
      ...value,
      pagination: { ...defaultLocale.pagination, ...value.pagination },
      dataTable: { ...defaultLocale.dataTable, ...value.dataTable },
      tour: { ...defaultLocale.tour, ...value.tour },
    }),
    [value],
  );
  return <LocaleContext.Provider value={merged}>{children}</LocaleContext.Provider>;
}

export function useLocale(): DsLocale {
  return useContext(LocaleContext);
}
