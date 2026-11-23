import { Button, FormField, Input } from "@enterprise/design-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod";
import { useFieldError } from "../../shared/form";
import { forgotPassword } from "./api";

const schema = z.object({ email: z.string().min(1, "validation.emailRequired").pipe(z.email("validation.emailInvalid")) });
type Values = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit({ email }: Values) {
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : t("auth.forgot.failed") });
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t("auth.forgot.title")}</h1>
      {sent ? (
        <p role="status" className="mt-4">
          {t("auth.forgot.sent")}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          <FormField id="forgot-email" label={t("auth.email")} required error={fieldError(errors.email)}>
            {(control) => <Input {...control} type="email" autoComplete="email" className="min-h-11" {...register("email")} />}
          </FormField>
          {errors.root && (
            <p role="alert" className="text-sm text-danger">
              {errors.root.message}
            </p>
          )}
          <Button type="submit" loading={isSubmitting} className="min-h-11 w-full">
            {t("auth.forgot.submit")}
          </Button>
        </form>
      )}
      <p className="mt-4 text-sm">
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">
          {t("auth.forgot.back")}
        </Link>
      </p>
    </>
  );
}
