import { Button, FormField, Input } from "@enterprise/design-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useFieldError } from "../../shared/form";
import { Seo } from "../../shared/Seo";
import { useAuth } from "./AuthProvider";

const schema = z
  .object({
    name: z.string().min(1, "validation.nameRequired"),
    email: z.string().min(1, "validation.emailRequired").pipe(z.email("validation.emailInvalid")),
    password: z.string().min(8, "validation.passwordMin"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "validation.confirmMismatch" });
type Values = z.infer<typeof schema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const { register: daftar } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "", confirm: "" } });

  async function onSubmit({ name, email, password }: Values) {
    try {
      await daftar({ name, email, password });
      navigate("/app", { replace: true });
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : t("auth.register.failed") });
    }
  }

  return (
    <>
      <Seo title={t("seo.registerTitle")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.register.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        <FormField id="reg-name" label={t("auth.name")} required error={fieldError(errors.name)}>
          {(control) => <Input {...control} autoComplete="name" className="min-h-11" {...register("name")} />}
        </FormField>
        <FormField id="reg-email" label={t("auth.email")} required error={fieldError(errors.email)}>
          {(control) => <Input {...control} type="email" autoComplete="email" className="min-h-11" {...register("email")} />}
        </FormField>
        <FormField id="reg-password" label={t("auth.password")} required hint={t("auth.passwordHint")} error={fieldError(errors.password)}>
          {(control) => <Input {...control} type="password" autoComplete="new-password" className="min-h-11" {...register("password")} />}
        </FormField>
        <FormField id="reg-confirm" label={t("auth.confirmPassword")} required error={fieldError(errors.confirm)}>
          {(control) => <Input {...control} type="password" autoComplete="new-password" className="min-h-11" {...register("confirm")} />}
        </FormField>
        {errors.root && (
          <p role="alert" className="text-sm text-danger">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="min-h-11 w-full">
          {t("auth.register.submit")}
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("auth.register.haveAccount")}{" "}
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">
          {t("auth.register.login")}
        </Link>
      </p>
    </>
  );
}
