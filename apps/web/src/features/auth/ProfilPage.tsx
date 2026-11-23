import { Button, FormField, Input, PageHeader, useToast } from "@wnp_code/design-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useFieldError } from "../../shared/form";
import { changePassword, updateProfile } from "./api";
import { useAuth } from "./AuthProvider";

const profilSchema = z.object({ name: z.string().min(1, "validation.nameRequired") });
const sandiSchema = z
  .object({
    current: z.string().min(1, "validation.currentPasswordRequired"),
    next: z.string().min(8, "validation.passwordMin"),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "validation.confirmMismatch" });

const pesan = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

function FormProfil() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profilSchema>>({ resolver: zodResolver(profilSchema), defaultValues: { name: user?.name ?? "" } });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof profilSchema>) {
    try {
      setUser(await updateProfile(values));
      toast({ title: t("auth.profile.saved"), variant: "success" });
    } catch (err) {
      form.setError("root", { message: pesan(err, t("auth.profile.saveFailed")) });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-sm space-y-5" aria-labelledby="profil-heading">
      <h2 id="profil-heading" className="text-lg font-semibold">
        {t("auth.profile.dataTitle")}
      </h2>
      <FormField id="profil-name" label={t("auth.name")} required error={fieldError(errors.name)}>
        {(control) => <Input {...control} autoComplete="name" className="min-h-11" {...form.register("name")} />}
      </FormField>
      <FormField id="profil-email" label={t("auth.email")} hint={t("auth.profile.emailHint")}>
        {(control) => <Input {...control} type="email" value={user?.email ?? ""} readOnly className="min-h-11" />}
      </FormField>
      {errors.root && (
        <p role="alert" className="text-sm text-danger">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="min-h-11">
        {t("auth.profile.save")}
      </Button>
    </form>
  );
}

function FormSandi() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof sandiSchema>>({
    resolver: zodResolver(sandiSchema),
    defaultValues: { current: "", next: "", confirm: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit({ current, next }: z.infer<typeof sandiSchema>) {
    try {
      await changePassword({ current, next });
      form.reset();
      toast({ title: t("auth.profile.passwordChanged"), variant: "success" });
    } catch (err) {
      form.setError("root", { message: pesan(err, t("auth.profile.passwordFailed")) });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-sm space-y-5" aria-labelledby="sandi-heading">
      <h2 id="sandi-heading" className="text-lg font-semibold">
        {t("auth.profile.passwordTitle")}
      </h2>
      <FormField id="sandi-current" label={t("auth.currentPassword")} required error={fieldError(errors.current)}>
        {(control) => (
          <Input {...control} type="password" autoComplete="current-password" className="min-h-11" {...form.register("current")} />
        )}
      </FormField>
      <FormField id="sandi-next" label={t("auth.newPassword")} required hint={t("auth.passwordHint")} error={fieldError(errors.next)}>
        {(control) => <Input {...control} type="password" autoComplete="new-password" className="min-h-11" {...form.register("next")} />}
      </FormField>
      <FormField id="sandi-confirm" label={t("auth.confirmNewPassword")} required error={fieldError(errors.confirm)}>
        {(control) => <Input {...control} type="password" autoComplete="new-password" className="min-h-11" {...form.register("confirm")} />}
      </FormField>
      {errors.root && (
        <p role="alert" className="text-sm text-danger">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" variant="outline" loading={isSubmitting} className="min-h-11">
        {t("auth.profile.changePassword")}
      </Button>
    </form>
  );
}

export function ProfilPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-10">
      <PageHeader title={t("auth.profile.title")} description={t("auth.profile.description")} />
      <FormProfil />
      <FormSandi />
    </div>
  );
}
