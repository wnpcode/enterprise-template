import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { apiUrl } from "../../mocks/url";
import { MemoryRouter, Route, Routes } from "react-router";
import { AUTH_STORAGE_KEY, AuthProvider, useAuth } from "./AuthProvider";
import { RedirectIfAuth, RequireAuth, RequireRole } from "./guards";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";

function Dashboard() {
  const { user } = useAuth();
  return <p>Dashboard {user?.name}</p>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route element={<RedirectIfAuth />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="app" element={<RequireAuth />}>
            <Route index element={<Dashboard />} />
            <Route element={<RequireRole roles={["admin"]} />}>
              <Route path="admin" element={<p>Area admin</p>} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

const seedSession = (id: number, name: string, roles: string[]) =>
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      refreshToken: `refresh.${id}.x`,
      user: { id, name, email: "guru@sekolah.id", roles },
      companies: [{ id: 1, name: "SMA Harapan Bangsa" }],
      companyId: 1,
    }),
  );

async function masuk(email = "guru@sekolah.id", password = "guru123") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email", { exact: false }), email);
  await user.type(screen.getByLabelText("Kata sandi", { exact: false }), password);
  await user.click(screen.getByRole("button", { name: "Masuk" }));
}

describe("autentikasi", () => {
  beforeEach(() => localStorage.clear());

  it("mengarahkan /app tanpa login ke form login", () => {
    renderAt("/app");
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
    expect(screen.queryByText(/Dashboard/)).not.toBeInTheDocument();
  });

  it("menolak form kosong dan email salah format dengan pesan per kolom", async () => {
    renderAt("/login");
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByText("Email wajib diisi.")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi wajib diisi.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email", { exact: false })).toHaveAttribute("aria-invalid", "true");
    await user.type(screen.getByLabelText("Email", { exact: false }), "bukan-email");
    await user.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByText("Format email tidak valid.")).toBeInTheDocument();
  });

  it("menampilkan pesan dari API saat kata sandi salah", async () => {
    renderAt("/login");
    await masuk("guru@sekolah.id", "salah");
    expect(await screen.findByRole("alert")).toHaveTextContent("Email atau kata sandi salah.");
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("menjelaskan server API tidak ditemukan saat login 404, bukan pesan generik", async () => {
    server.use(http.post(apiUrl("/auth/login"), () => new HttpResponse(null, { status: 404 }), { once: true }));
    renderAt("/login");
    await masuk();
    expect(await screen.findByRole("alert")).toHaveTextContent("Server API tidak ditemukan");
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("login menyimpan sesi (refresh token + user) dan menampilkan Dashboard", async () => {
    renderAt("/app");
    await masuk();
    expect(await screen.findByText("Dashboard Budi Guru")).toBeInTheDocument();
    const sesi = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null");
    expect(sesi.refreshToken).toMatch(/^refresh\.2\./);
    expect(sesi.user).toMatchObject({ email: "guru@sekolah.id", roles: ["guru"] });
  });

  it("login superadmin menyimpan semua company dan memilih default; reload tidak mengambilnya lagi", async () => {
    const { unmount } = renderAt("/app");
    await masuk("superadmin@sekolah.id", "super123");
    expect(await screen.findByText("Dashboard Sari Superadmin")).toBeInTheDocument();
    const sesi = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null");
    expect(sesi.companies).toHaveLength(25);
    expect(sesi.companyId).toBe(1);
    unmount();

    let diambil = 0;
    server.events.on("request:start", ({ request }) => {
      if (request.url.endsWith("/auth/companies")) diambil++;
    });
    renderAt("/app");
    expect(await screen.findByText("Dashboard Sari Superadmin")).toBeInTheDocument();
    server.events.removeAllListeners();
    expect(diambil).toBe(0);
  });

  it("login role lain hanya mendapat company miliknya", async () => {
    renderAt("/app");
    await masuk();
    await screen.findByText("Dashboard Budi Guru");
    const sesi = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null");
    expect(sesi.companies).toEqual([{ id: 1, name: "SMA Harapan Bangsa" }]);
    expect(sesi.companyId).toBe(1);
  });

  it("login gagal bila daftar company tidak bisa dimuat dan tidak meninggalkan sesi", async () => {
    server.use(
      http.get(apiUrl("/auth/companies"), () => HttpResponse.json({ message: "Company gagal dimuat." }, { status: 500 }), { once: true }),
    );
    renderAt("/login");
    await masuk();
    expect(await screen.findByRole("alert")).toHaveTextContent("Company gagal dimuat.");
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("selectCompany menyimpan pilihan di sesi dan menolak id yang tidak ada di daftar", async () => {
    function Pilih() {
      const { company, selectCompany } = useAuth();
      return (
        <>
          <p>Company {company?.name}</p>
          <button onClick={() => selectCompany(2)}>ke 2</button>
          <button onClick={() => selectCompany(99)}>ke 99</button>
        </>
      );
    }
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        refreshToken: "refresh.3.x",
        user: { id: 3, name: "Sari Superadmin", email: "superadmin@sekolah.id", roles: ["superadmin"] },
        companies: [
          { id: 1, name: "SMA Harapan Bangsa" },
          { id: 2, name: "SMP Cahaya Ilmu" },
        ],
        companyId: 1,
      }),
    );
    render(
      <AuthProvider>
        <Pilih />
      </AuthProvider>,
    );
    const user = userEvent.setup();
    expect(screen.getByText("Company SMA Harapan Bangsa")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "ke 99" }));
    expect(screen.getByText("Company SMA Harapan Bangsa")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "ke 2" }));
    expect(screen.getByText("Company SMP Cahaya Ilmu")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null").companyId).toBe(2);
  });

  it("sesi tersimpan dipakai langsung lalu profil diperbarui dari /auth/me", async () => {
    seedSession(2, "Nama Lama", ["guru"]);
    renderAt("/app");
    expect(screen.getByText("Dashboard Nama Lama")).toBeInTheDocument();
    expect(await screen.findByText("Dashboard Budi Guru")).toBeInTheDocument();
  });

  it("sesi tersimpan yang ditolak server mengeluarkan pengguna", async () => {
    seedSession(99, "Hantu", ["guru"]);
    renderAt("/app");
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("RequireRole menolak role lain dan meloloskan admin", async () => {
    seedSession(2, "Budi Guru", ["guru"]);
    const { unmount } = renderAt("/app/admin");
    expect(screen.getByRole("heading", { name: "Akses ditolak" })).toBeInTheDocument();
    unmount();
    seedSession(1, "Rina Admin", ["admin"]);
    renderAt("/app/admin");
    expect(screen.getByText("Area admin")).toBeInTheDocument();
  });

  it("daftar akun baru langsung masuk", async () => {
    renderAt("/register");
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nama lengkap", { exact: false }), "Siti Baru");
    await user.type(screen.getByLabelText("Email", { exact: false }), "siti@sekolah.id");
    await user.type(screen.getByLabelText(/^Kata sandi/), "rahasia123");
    await user.type(screen.getByLabelText("Ulangi kata sandi", { exact: false }), "rahasia123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));
    expect(await screen.findByText("Dashboard Siti Baru")).toBeInTheDocument();
  });
});
