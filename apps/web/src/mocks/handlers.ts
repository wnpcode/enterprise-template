import { delay, http, HttpResponse } from "msw";
import { siswaContoh, type Siswa } from "../features/siswa";
import { authHandlers } from "./auth";
import { apiUrl } from "./url";

export { apiUrl };

// jeda hanya di browser agar state memuat terlihat; test tidak menunggu
const jeda = () => (import.meta.env.MODE === "test" ? Promise.resolve() : delay(400));

export const handlers = [
  ...authHandlers,
  http.post(apiUrl("/kontak"), async ({ request }) => {
    const { nama, email, pesan } = (await request.json()) as { nama?: string; email?: string; pesan?: string };
    if (!nama?.trim() || !email?.trim() || !pesan?.trim())
      return HttpResponse.json({ message: "Nama, email, dan pesan wajib diisi." }, { status: 422 });
    await jeda();
    return new HttpResponse(null, { status: 204 });
  }),
  // shortcut: /siswa tidak memeriksa Bearer agar test halaman tidak butuh sesi; backend nyata wajib memeriksanya
  http.get(apiUrl("/siswa"), async ({ request }) => {
    const p = new URL(request.url).searchParams;
    const q = (p.get("q") ?? "").trim().toLowerCase();
    const page = Math.max(1, Number(p.get("page") ?? 1));
    const size = Math.min(100, Math.max(1, Number(p.get("size") ?? 10)));
    const sort = p.get("sort") as keyof Siswa | null;
    const order = p.get("order") === "desc" ? -1 : 1;
    const cocok = siswaContoh.filter((s) => s.nama.toLowerCase().includes(q));
    if (sort) cocok.sort((a, b) => (a[sort] < b[sort] ? -order : a[sort] > b[sort] ? order : 0));
    await jeda();
    return HttpResponse.json({ items: cocok.slice((page - 1) * size, page * size), total: cocok.length });
  }),
  http.post(apiUrl("/siswa"), async ({ request }) => {
    const { nama, kelas } = (await request.json()) as { nama?: string; kelas?: string };
    if (!nama?.trim() || !kelas?.trim()) return HttpResponse.json({ message: "Nama dan kelas wajib diisi." }, { status: 422 });
    const baru: Siswa = {
      id: Math.max(0, ...siswaContoh.map((s) => s.id)) + 1,
      nama: nama.trim(),
      kelas: kelas.trim(),
      status: "Menunggu",
      terdaftar: new Date().toISOString().slice(0, 10),
    };
    siswaContoh.unshift(baru);
    await jeda();
    return HttpResponse.json(baru, { status: 201 });
  }),
  http.patch(apiUrl("/siswa/:id"), async ({ request, params }) => {
    const { status, nama, kelas } = (await request.json()) as { status?: string; nama?: string; kelas?: string };
    const siswa = siswaContoh.find((s) => s.id === Number(params.id));
    if (!siswa) return HttpResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
    if (status !== undefined) {
      if (status !== "Aktif" && status !== "Ditolak") return HttpResponse.json({ message: "Status tidak valid." }, { status: 422 });
      siswa.status = status;
    } else {
      if (!nama?.trim() || !kelas?.trim()) return HttpResponse.json({ message: "Nama dan kelas wajib diisi." }, { status: 422 });
      siswa.nama = nama.trim();
      siswa.kelas = kelas.trim();
    }
    await jeda();
    return HttpResponse.json(siswa);
  }),
  http.delete(apiUrl("/siswa/:id"), async ({ params }) => {
    const i = siswaContoh.findIndex((s) => s.id === Number(params.id));
    if (i < 0) return HttpResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
    siswaContoh.splice(i, 1);
    await jeda();
    return new HttpResponse(null, { status: 204 });
  }),
];
