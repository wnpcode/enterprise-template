import { http, HttpResponse } from "msw";
import { apiUrl } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { setAuthHooks } from "../../shared/api/client";
import { createSiswa, fetchSiswa } from "./api";

describe("company_id di API siswa", () => {
  afterEach(() => setAuthHooks({ getCompanyId: () => null }));

  it("fetchSiswa mengirim company_id di query bila ada company terpilih, dan tidak mengirimnya bila tidak ada", async () => {
    const dilihat: Array<string | null> = [];
    server.use(
      http.get(apiUrl("/siswa"), ({ request }) => {
        dilihat.push(new URL(request.url).searchParams.get("company_id"));
        return HttpResponse.json({ items: [], total: 0 });
      }),
    );
    setAuthHooks({ getCompanyId: () => 2 });
    await fetchSiswa();
    setAuthHooks({ getCompanyId: () => null });
    await fetchSiswa();
    expect(dilihat).toEqual(["2", null]);
  });

  it("createSiswa mengirim company_id di body", async () => {
    let body: unknown;
    server.use(
      http.post(apiUrl("/siswa"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 1, nama: "A", kelas: "X", status: "Menunggu", terdaftar: "2026-01-01" }, { status: 201 });
      }),
    );
    setAuthHooks({ getCompanyId: () => 3 });
    await createSiswa({ nama: "A", kelas: "X" });
    expect(body).toEqual({ nama: "A", kelas: "X", company_id: 3 });
  });
});
