import { api } from "../../shared/api/client";

export type KontakInput = { nama: string; email: string; sekolah: string; pesan: string };

export const kirimKontak = (json: KontakInput) => api<void>("/kontak", { method: "POST", json });
