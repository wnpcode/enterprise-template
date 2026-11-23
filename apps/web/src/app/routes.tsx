import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import { RedirectIfAuth, RequireAuth, RequireRole } from "../features/auth";
import { LandingPage } from "../features/landing";
import { NotFoundPage } from "../shared/NotFoundPage";
import { RouteErrorBoundary } from "../shared/RouteErrorBoundary";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingLayout } from "./layouts/LandingLayout";

// halaman selain landing dimuat lazy agar bundle awal landing kecil; Suspense ada di RouteErrorBoundary
const LoginPage = lazy(() => import("../features/auth").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("../features/auth").then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import("../features/auth").then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("../features/auth").then((m) => ({ default: m.ResetPasswordPage })));
const ProfilPage = lazy(() => import("../features/auth").then((m) => ({ default: m.ProfilPage })));
const DashboardPage = lazy(() => import("../features/dashboard").then((m) => ({ default: m.DashboardPage })));
const SiswaPage = lazy(() => import("../features/siswa").then((m) => ({ default: m.SiswaPage })));
const PengaturanPage = lazy(() => import("../features/pengaturan").then((m) => ({ default: m.PengaturanPage })));
const KonfigurasiCompanyPage = lazy(() => import("../features/konfigurasi").then((m) => ({ default: m.KonfigurasiCompanyPage })));
const ReportingPage = lazy(() => import("../features/reporting").then((m) => ({ default: m.ReportingPage })));
const KomponenListPage = lazy(() => import("../features/komponen").then((m) => ({ default: m.KomponenListPage })));
const KomponenDetailPage = lazy(() => import("../features/komponen").then((m) => ({ default: m.KomponenDetailPage })));

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route element={<RouteErrorBoundary />}>
          <Route index element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
      <Route element={<RedirectIfAuth />}>
        <Route element={<AuthLayout />}>
          <Route element={<RouteErrorBoundary />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="lupa-sandi" element={<ForgotPasswordPage />} />
            <Route path="reset-sandi" element={<ResetPasswordPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="app" element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RouteErrorBoundary />}>
            <Route index element={<DashboardPage />} />
            <Route path="siswa" element={<SiswaPage />} />
            <Route path="reporting" element={<Navigate to="siswa" replace />} />
            <Route path="reporting/siswa" element={<ReportingPage jenis="siswa" />} />
            <Route path="reporting/pendaftaran" element={<ReportingPage jenis="pendaftaran" />} />
            <Route element={<RequireRole roles={["admin", "superadmin"]} />}>
              <Route path="konfigurasi-company" element={<KonfigurasiCompanyPage />} />
            </Route>
            <Route path="pengaturan" element={<PengaturanPage />} />
            <Route path="profil" element={<ProfilPage />} />
            <Route element={<RequireRole roles={["admin", "superadmin"]} />}>
              <Route path="komponen" element={<KomponenListPage />} />
              <Route path="komponen/:slug" element={<KomponenDetailPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
