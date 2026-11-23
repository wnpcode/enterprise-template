import { Button, FormField, Input } from "@enterprise/design-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { env } from "../../app/env";
import { ApiError } from "../../shared/api/client";
import { useFieldError } from "../../shared/form";
import { Seo } from "../../shared/Seo";
import { useAuth } from "./AuthProvider";

const schema = z.object({
  email: z.string().min(1, "validation.emailRequired").pipe(z.email("validation.emailInvalid")),
  password: z.string().min(1, "validation.passwordRequired"),
});
type Values = z.infer<typeof schema>;

function destinasiAman(state: unknown): string {
  const from = typeof state === "object" && state !== null ? (state as { from?: unknown }).from : undefined;
  return typeof from === "string" && from.startsWith("/app") ? from : "/app";
}

export function LoginPage() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: Values) {
    try {
      await login(values.email, values.password);
      navigate(destinasiAman(location.state), { replace: true });
    } catch (err) {
      // 404 di endpoint login berarti server API tidak terjangkau (mock mati atau VITE_API_URL salah), bukan kredensial salah
      const message =
        err instanceof ApiError && err.status === 404
          ? t("auth.login.apiMissing")
          : err instanceof Error
            ? err.message
            : t("auth.login.failed");
      setError("root", { message });
    }
  }

  return (
    <>
      <Seo title={t("seo.loginTitle")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.login.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        <FormField id="login-email" label={t("auth.email")} required error={fieldError(errors.email)}>
          {(control) => <Input {...control} type="email" autoComplete="email" className="min-h-11" {...register("email")} />}
        </FormField>
        <FormField id="login-password" label={t("auth.password")} required error={fieldError(errors.password)}>
          {(control) => (
            <Input {...control} type="password" autoComplete="current-password" className="min-h-11" {...register("password")} />
          )}
        </FormField>
        {errors.root && (
          <p role="alert" className="text-sm text-danger">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="min-h-11 w-full">
          {t("auth.login.submit")}
        </Button>
      </form>
      <div className="mt-4 gap-2 text-sm flex flex-wrap justify-between">
        <Link to="/lupa-sandi" className="text-primary underline-offset-4 hover:underline">
          {t("auth.login.forgot")}
        </Link>
        <Link to="/register" className="text-primary underline-offset-4 hover:underline">
          {t("auth.login.register")}
        </Link>
      </div>
      {env.VITE_API_MOCK === "1" && <p className="mt-6 text-sm text-muted-foreground">{t("auth.login.demo")}</p>}
    </>
  );
}
