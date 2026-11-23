import { http, HttpResponse } from "msw";
import type { User } from "../features/auth";
import { apiUrl } from "./url";

type Akun = User & { password: string };

// shortcut: akun hidup di memori halaman, hasil daftar dan ganti sandi hilang saat reload; pindah ke localStorage bila mengganggu
const akun: Akun[] = [
  { id: 1, name: "Rina Admin", email: "admin@sekolah.id", password: "admin123", roles: ["admin"] },
  { id: 2, name: "Budi Guru", email: "guru@sekolah.id", password: "guru123", roles: ["guru"] },
];

const ACCESS_TTL_MS = 15 * 60_000;
const publik = (a: Akun): User => ({ id: a.id, name: a.name, email: a.email, roles: a.roles });
// token stateless (berisi id dan kedaluwarsa) agar sesi tetap valid setelah reload tanpa store di worker
const tokens = (u: Akun) => ({
  accessToken: `access.${u.id}.${Date.now() + ACCESS_TTL_MS}`,
  refreshToken: `refresh.${u.id}.${Math.random().toString(36).slice(2)}`,
});
const cariId = (id: number) => akun.find((a) => a.id === id);

function akunDariBearer(request: Request): Akun | undefined {
  const m = /^Bearer access\.(\d+)\.(\d+)$/.exec(request.headers.get("Authorization") ?? "");
  if (!m || Number(m[2]) < Date.now()) return undefined;
  return cariId(Number(m[1]));
}

const unauthorized = () => HttpResponse.json({ message: "Sesi berakhir, silakan masuk lagi." }, { status: 401 });
const noContent = () => new HttpResponse(null, { status: 204 });
const body = <T>(request: Request) => request.json() as Promise<T>;

export const authHandlers = [
  http.post(apiUrl("/auth/login"), async ({ request }) => {
    const { email, password } = await body<{ email?: string; password?: string }>(request);
    const u = akun.find((a) => a.email === email && a.password === password);
    if (!u) return HttpResponse.json({ message: "Email atau kata sandi salah." }, { status: 401 });
    return HttpResponse.json({ ...tokens(u), user: publik(u) });
  }),
  http.post(apiUrl("/auth/refresh"), async ({ request }) => {
    const { refreshToken } = await body<{ refreshToken?: string }>(request);
    const u = cariId(Number(/^refresh\.(\d+)\./.exec(refreshToken ?? "")?.[1]));
    return u ? HttpResponse.json(tokens(u)) : unauthorized();
  }),
  http.get(apiUrl("/auth/me"), ({ request }) => {
    const u = akunDariBearer(request);
    return u ? HttpResponse.json(publik(u)) : unauthorized();
  }),
  http.patch(apiUrl("/auth/me"), async ({ request }) => {
    const u = akunDariBearer(request);
    if (!u) return unauthorized();
    const { name } = await body<{ name?: string }>(request);
    if (!name?.trim()) return HttpResponse.json({ message: "Nama wajib diisi." }, { status: 422 });
    u.name = name.trim();
    return HttpResponse.json(publik(u));
  }),
  http.post(apiUrl("/auth/password"), async ({ request }) => {
    const u = akunDariBearer(request);
    if (!u) return unauthorized();
    const { current, next } = await body<{ current?: string; next?: string }>(request);
    if (u.password !== current) return HttpResponse.json({ message: "Kata sandi saat ini salah." }, { status: 422 });
    u.password = next ?? u.password;
    return noContent();
  }),
  http.post(apiUrl("/auth/register"), async ({ request }) => {
    const { name, email, password } = await body<{ name: string; email: string; password: string }>(request);
    if (akun.some((a) => a.email === email)) return HttpResponse.json({ message: "Email sudah terdaftar." }, { status: 409 });
    const u: Akun = { id: Math.max(...akun.map((a) => a.id)) + 1, name, email, password, roles: ["guru"] };
    akun.push(u);
    return HttpResponse.json({ ...tokens(u), user: publik(u) });
  }),
  http.post(apiUrl("/auth/forgot"), async ({ request }) => {
    const { email } = await body<{ email?: string }>(request);
    const u = akun.find((a) => a.email === email);
    if (u && import.meta.env.DEV) console.info(`[mock] tautan reset untuk ${u.email}: /reset-sandi?token=reset.${u.id}`);
    return noContent();
  }),
  http.post(apiUrl("/auth/reset"), async ({ request }) => {
    const { token, password } = await body<{ token?: string; password?: string }>(request);
    const u = cariId(Number(/^reset\.(\d+)$/.exec(token ?? "")?.[1]));
    if (!u || !password) return HttpResponse.json({ message: "Tautan reset tidak valid atau kedaluwarsa." }, { status: 400 });
    u.password = password;
    return noContent();
  }),
];
