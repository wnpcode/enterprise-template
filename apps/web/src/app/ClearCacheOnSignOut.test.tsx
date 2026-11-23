import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AUTH_STORAGE_KEY, AuthProvider, useAuth } from "../features/auth";
import { ClearCacheOnSignOut } from "./App";

function Keluar() {
  const { logout } = useAuth();
  return <button onClick={logout}>keluar</button>;
}

describe("ClearCacheOnSignOut", () => {
  it("mengosongkan cache query saat logout agar data tidak bocor ke pengguna berikutnya", async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        refreshToken: "refresh.2.x",
        user: { id: 2, name: "Budi Guru", email: "guru@sekolah.id", roles: ["guru"] },
        companies: [{ id: 1, name: "SMA Harapan Bangsa" }],
        companyId: 1,
      }),
    );
    const queryClient = new QueryClient();
    queryClient.setQueryData(["siswa", "list", {}], { items: [{ id: 1, nama: "Milik pengguna sebelumnya" }] });
    render(
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ClearCacheOnSignOut />
          <Keluar />
        </QueryClientProvider>
      </AuthProvider>,
    );
    expect(queryClient.getQueryData(["siswa", "list", {}])).toBeDefined();
    await userEvent.setup().click(screen.getByRole("button", { name: "keluar" }));
    expect(queryClient.getQueryData(["siswa", "list", {}])).toBeUndefined();
  });
});
