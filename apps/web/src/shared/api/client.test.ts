import { http, HttpResponse } from "msw";
import { apiUrl } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { api, ApiError, setAuthHooks } from "./client";

describe("api client", () => {
  afterEach(() => setAuthHooks({ getToken: () => null, refresh: async () => false, onUnauthorized: () => {} }));

  it("mengirim Bearer token dan mem-parse JSON", async () => {
    setAuthHooks({ getToken: () => "tok" });
    server.use(http.get(apiUrl("/me"), ({ request }) => HttpResponse.json({ auth: request.headers.get("Authorization") })));
    expect(await api<{ auth: string }>("/me")).toEqual({ auth: "Bearer tok" });
  });

  it("melempar ApiError berisi message dari body", async () => {
    server.use(http.post(apiUrl("/x"), () => HttpResponse.json({ message: "Tidak boleh" }, { status: 422 })));
    await expect(api("/x", { method: "POST", json: { a: 1 } })).rejects.toMatchObject({ status: 422, message: "Tidak boleh" });
    await expect(api("/x", { method: "POST" })).rejects.toBeInstanceOf(ApiError);
  });

  it("saat 401 memperbarui token sekali lalu mengulang request", async () => {
    let token = "lama";
    const refresh = vi.fn(async () => {
      token = "baru";
      return true;
    });
    setAuthHooks({ getToken: () => token, refresh });
    server.use(
      http.get(apiUrl("/rahasia"), ({ request }) =>
        request.headers.get("Authorization") === "Bearer baru" ? HttpResponse.json({ ok: true }) : new HttpResponse(null, { status: 401 }),
      ),
    );
    expect(await api("/rahasia")).toEqual({ ok: true });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("saat refresh gagal memanggil onUnauthorized dan melempar 401", async () => {
    const onUnauthorized = vi.fn();
    setAuthHooks({ getToken: () => "lama", refresh: async () => false, onUnauthorized });
    server.use(http.get(apiUrl("/rahasia"), () => new HttpResponse(null, { status: 401 })));
    await expect(api("/rahasia")).rejects.toMatchObject({ status: 401 });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
