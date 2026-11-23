import { Button, FormField, Input, useToast } from "@wnp_code/design-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import { useFieldError } from "../../shared/form";
import { resetPassword } from "./api";

const schema = z
  .object({ password: z.string().min(8, "validation.passwordMin"), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "validation.confirmMismatch" });
type Values = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const token = useSearchParams()[0].get("token") ?? "";
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: "", confirm: "" } });

  async function onSubmit({ password }: Values) {
    try {
      await resetPassword({ token, password });
      toast({ title: t("auth.reset.done"), description: t("auth.reset.doneText"), variant: "success" });
      navigate("/login", { replace: true });
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : t("auth.reset.failed") });
    }
  }

  if (!token) {
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">{t("auth.reset.noTokenTitle")}</h1>
        <p className="mt-4 text-muted-foreground">{t("auth.reset.noTokenText")}</p>
        <p className="mt-4 text-sm">
          <Link to="/lupa-sandi" className="text-primary underline-offset-4 hover:underline">
            {t("auth.reset.requestNew")}
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.reset.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        <FormField
          id="reset-password"
          label={t("auth.newPassword")}
          required
          hint={t("auth.passwordHint")}
          error={fieldError(errors.password)}
        >
          {(control) => <Input {...control} type="password" autoComplete="new-password" className="min-h-11" {...register("password")} />}
        </FormField>
        <FormField id="reset-confirm" label={t("auth.confirmPassword")} required error={fieldError(errors.confirm)}>
          {(control) => <Input {...control} type="password" autoComplete="new-password" className="min-h-11" {...register("confirm")} />}
        </FormField>
        {errors.root && (
          <p role="alert" className="text-sm text-danger">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="min-h-11 w-full">
          {t("auth.reset.submit")}
        </Button>
      </form>
    </>
  );
}
