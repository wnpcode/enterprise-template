import { env } from "../../app/env";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type AuthHooks = {
  getToken: () => string | null;
  /** Coba perbarui token; true bila berhasil dan request boleh diulang. */
  refresh: () => Promise<boolean>;
  onUnauthorized: () => void;
};

let auth: AuthHooks = { getToken: () => null, refresh: async () => false, onUnauthorized: () => {} };

// didaftarkan AuthProvider; client tidak mengimpor fitur auth agar tidak ada import melingkar
export function setAuthHooks(next: Partial<AuthHooks>) {
  auth = { ...auth, ...next };
}

export type ApiInit = Omit<RequestInit, "body" | "headers"> & { json?: unknown; headers?: Record<string, string> };

function baseUrl() {
  return env.VITE_API_URL.startsWith("/") ? window.location.origin + env.VITE_API_URL : env.VITE_API_URL;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = res.status === 204 ? "" : await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function messageOf(body: unknown, status: number) {
  const message = typeof body === "object" && body !== null ? (body as { message?: unknown }).message : undefined;
  return typeof message === "string" ? message : `Permintaan gagal (${status}).`;
}

/** `allowRefresh=false` untuk endpoint refresh itu sendiri agar tidak berputar. */
export async function api<T>(path: string, init: ApiInit = {}, allowRefresh = true): Promise<T> {
  const { json, headers, ...rest } = init;
  const token = auth.getToken();
  const res = await fetch(baseUrl() + path, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(json !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });
  if (res.status === 401) {
    if (allowRefresh && (await auth.refresh())) return api<T>(path, init, false);
    auth.onUnauthorized();
  }
  const body = await parseBody(res);
  if (!res.ok) throw new ApiError(res.status, messageOf(body, res.status), body);
  return body as T;
}
