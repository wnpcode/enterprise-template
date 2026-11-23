import { Navigate, Outlet, useLocation } from "react-router";
import { ForbiddenPage } from "../../shared/ForbiddenPage";
import type { User } from "./api";
import { useAuth } from "./AuthProvider";

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function RedirectIfAuth() {
  const { user } = useAuth();
  if (user) return <Navigate to="/app" replace />;
  return <Outlet />;
}

/** Dipasang di dalam RequireAuth. Lolos bila pengguna punya salah satu role. */
export function RequireRole({ roles }: { roles: string[] }) {
  const { user } = useAuth();
  if (!user || !roles.some((r) => user.roles.includes(r))) return <ForbiddenPage />;
  return <Outlet />;
}

export const hasRole = (user: User | null, roles?: string[]) => !roles || (!!user && roles.some((r) => user.roles.includes(r)));
