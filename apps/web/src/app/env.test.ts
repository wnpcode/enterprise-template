async function muat(url: string) {
  vi.resetModules();
  vi.stubEnv("VITE_API_URL", url);
  return import("./env");
}

describe("env VITE_API_URL", () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each(["/api", "https://api.contoh.id/api", "http://localhost:8000/api", "http://127.0.0.1/api"])("menerima %s", async (url) => {
    expect((await muat(url)).env.VITE_API_URL).toBe(url);
  });

  it.each(["http://api.contoh.id/api", "//jahat.example/api", "javascript:alert(1)", "ftp://x/api", "api"])("menolak %s", async (url) => {
    await expect(muat(url)).rejects.toThrow(/Konfigurasi env tidak valid/);
  });
});
