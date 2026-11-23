import { api, selectedCompanyId } from "../../shared/api/client";

export type SiswaStatus = "Aktif" | "Menunggu" | "Ditolak";
export type Siswa = { id: number; nama: string; kelas: string; status: SiswaStatus; terdaftar: string };
export type SiswaListParams = { q?: string; page?: number; size?: number; sort?: keyof Siswa; order?: "asc" | "desc" };
export type SiswaInput = { nama: string; kelas: string };
export type SiswaList = { items: Siswa[]; total: number };

export const siswaKeys = {
  all: ["siswa"] as const,
  list: (params: SiswaListParams) => ["siswa", "list", params] as const,
};

export function fetchSiswa(params: SiswaListParams = {}): Promise<SiswaList> {
  const qs = new URLSearchParams();
  const companyId = selectedCompanyId();
  if (companyId !== null) qs.set("company_id", String(companyId));
  if (params.q) qs.set("q", params.q);
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));
  if (params.sort) qs.set("sort", params.sort);
  if (params.order) qs.set("order", params.order);
  const s = qs.toString();
  return api<SiswaList>(`/siswa${s ? `?${s}` : ""}`);
}

export const createSiswa = (input: SiswaInput) => {
  const companyId = selectedCompanyId();
  return api<Siswa>("/siswa", { method: "POST", json: companyId === null ? input : { ...input, company_id: companyId } });
};

export const updateSiswa = (id: number, json: SiswaInput) => api<Siswa>(`/siswa/${id}`, { method: "PATCH", json });

export const deleteSiswa = (id: number) => api<void>(`/siswa/${id}`, { method: "DELETE" });

export const updateSiswaStatus = (id: number, status: Exclude<SiswaStatus, "Menunggu">) =>
  api<Siswa>(`/siswa/${id}`, { method: "PATCH", json: { status } });
