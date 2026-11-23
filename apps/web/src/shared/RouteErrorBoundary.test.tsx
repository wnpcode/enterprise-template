import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, Outlet, Route, Routes, useOutletContext } from "react-router";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

function Rusak(): never {
  throw new Error("meledak");
}

function Layout() {
  return (
    <>
      <Link to="/aman">Aman</Link>
      <Outlet context={{ pesan: "dari layout" }} />
    </>
  );
}

function Aman() {
  const ctx = useOutletContext<{ pesan: string }>();
  return <p>Halaman aman {ctx.pesan}</p>;
}

it("mengganti halaman error dengan ErrorPage, pulih saat pindah halaman, dan meneruskan outlet context", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  render(
    <MemoryRouter initialEntries={["/rusak"]}>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<RouteErrorBoundary />}>
            <Route path="rusak" element={<Rusak />} />
            <Route path="aman" element={<Aman />} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "Terjadi kesalahan" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("link", { name: "Aman" }));
  expect(screen.getByText("Halaman aman dari layout")).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Terjadi kesalahan" })).toBeNull();
});
