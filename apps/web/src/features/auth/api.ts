import { api } from "../../shared/api/client";

export type User = { id: number; name: string; email: string; roles: string[] };
export type Company = { id: number; name: string };
export type CompanyList = { items: Company[]; defaultId: number };
export type AuthTokens = { accessToken: string; refreshToken: string };
export type LoginResponse = AuthTokens & { user: User };
export type RegisterInput = { name: string; email: string; password: string };

export const login = (json: { email: string; password: string }) => api<LoginResponse>("/auth/login", { method: "POST", json });
export const refresh = (refreshToken: string) => api<AuthTokens>("/auth/refresh", { method: "POST", json: { refreshToken } }, false);
export const fetchMe = () => api<User>("/auth/me");
export const register = (json: RegisterInput) => api<LoginResponse>("/auth/register", { method: "POST", json });
export const forgotPassword = (email: string) => api<void>("/auth/forgot", { method: "POST", json: { email } });
export const resetPassword = (json: { token: string; password: string }) => api<void>("/auth/reset", { method: "POST", json });
export const updateProfile = (json: { name: string }) => api<User>("/auth/me", { method: "PATCH", json });
export const changePassword = (json: { current: string; next: string }) => api<void>("/auth/password", { method: "POST", json });

/** Dipanggil sekali setelah login berhasil; hasilnya disimpan di sesi. */
export const fetchCompanies = () => api<CompanyList>("/auth/companies");
