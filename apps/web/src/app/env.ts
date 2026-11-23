import { z } from "zod";

const schema = z.object({
  // token dikirim ke alamat ini: hanya path relatif, https, atau localhost (dev)
  VITE_API_URL: z
    .string()
    .min(1)
    .default("/api")
    .refine((u) => /^\/(?!\/)/.test(u) || /^https:\/\/[^/]/.test(u) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(u), {
      message: "harus path relatif (/api), https://, atau http://localhost",
    }),
  VITE_API_MOCK: z.enum(["0", "1"]).default("0"),
  VITE_APP_NAME: z.string().min(1),
});

const parsed = schema.safeParse(import.meta.env);
if (!parsed.success) throw new Error(`Konfigurasi env tidak valid:\n${z.prettifyError(parsed.error)}`);

export const env = parsed.data;
