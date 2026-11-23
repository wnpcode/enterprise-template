import { Alert, Button, FormField, Input, Textarea } from "@wnpcode/design-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useFieldError } from "../../../shared/form";
import { kirimKontak } from "../api";

const schema = z.object({
  nama: z.string().min(1, "validation.nameRequired"),
  email: z.string().min(1, "validation.emailRequired").pipe(z.email("validation.emailInvalid")),
  sekolah: z.string().min(1, "validation.schoolRequired"),
  pesan: z.string().min(1, "validation.messageRequired"),
});
type Values = z.infer<typeof schema>;

export function Kontak() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const [sent, setSent] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { nama: "", email: "", sekolah: "", pesan: "" } });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: Values) {
    try {
      await kirimKontak(values);
      form.reset();
      setSent(true);
    } catch (err) {
      form.setError("root", { message: err instanceof Error ? err.message : t("landing.contact.failed") });
    }
  }

  return (
    <section id="kontak" data-reveal className="scroll-mt-20 py-16 lg:py-24 border-t border-border">
      <div className="gap-8 lg:grid-cols-12 grid">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t("landing.contact.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("landing.contact.text")}</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5 lg:col-span-6" aria-label={t("landing.contact.title")}>
          {sent && (
            <Alert variant="success" live>
              {t("landing.contact.sent")}
            </Alert>
          )}
          <div className="gap-5 sm:grid-cols-2 grid">
            <FormField id="kontak-nama" label={t("auth.name")} required error={fieldError(errors.nama)}>
              {(c) => <Input {...c} autoComplete="name" className="min-h-11" {...form.register("nama")} />}
            </FormField>
            <FormField id="kontak-email" label={t("auth.email")} required error={fieldError(errors.email)}>
              {(c) => <Input {...c} type="email" autoComplete="email" className="min-h-11" {...form.register("email")} />}
            </FormField>
          </div>
          <FormField id="kontak-sekolah" label={t("landing.contact.school")} required error={fieldError(errors.sekolah)}>
            {(c) => <Input {...c} autoComplete="organization" className="min-h-11" {...form.register("sekolah")} />}
          </FormField>
          <FormField id="kontak-pesan" label={t("landing.contact.message")} required error={fieldError(errors.pesan)}>
            {(c) => <Textarea {...c} rows={5} {...form.register("pesan")} />}
          </FormField>
          {errors.root && (
            <p role="alert" className="text-sm text-danger">
              {errors.root.message}
            </p>
          )}
          <Button type="submit" loading={isSubmitting} className="min-h-11">
            {t("landing.contact.submit")}
          </Button>
        </form>
      </div>
    </section>
  );
}
