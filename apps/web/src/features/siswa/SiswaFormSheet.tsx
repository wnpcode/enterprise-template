import {
  Button,
  FormField,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useToast,
} from "@wnp_code/design-system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useFieldError } from "../../shared/form";
import { createSiswa, siswaKeys, updateSiswa, type Siswa } from "./api";

const schema = z.object({
  nama: z.string().min(1, "validation.nameRequired"),
  kelas: z.string().min(1, "validation.kelasRequired"),
});
type Values = z.infer<typeof schema>;

type Props = {
  trigger?: ReactNode;
  /** Bila ada, form mengubah siswa ini; tanpa itu form menambah siswa baru. */
  siswa?: Siswa;
  /** Kendali dari luar untuk dibuka dari menu baris (trigger di dalam menu ikut hilang saat menu menutup). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SiswaFormSheet({ trigger, siswa, open: openProp, onOpenChange }: Props) {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { nama: siswa?.nama ?? "", kelas: siswa?.kelas ?? "" } });
  const { errors } = form.formState;

  const simpan = useMutation({
    mutationFn: (v: Values) => (siswa ? updateSiswa(siswa.id, v) : createSiswa(v)),
    onSuccess: (hasil) => {
      queryClient.invalidateQueries({ queryKey: siswaKeys.all });
      toast(
        siswa
          ? { title: t("siswa.sheet.updated"), description: hasil.nama, variant: "success" }
          : { title: t("siswa.sheet.added"), description: t("siswa.sheet.addedText", { nama: hasil.nama }), variant: "success" },
      );
      if (!siswa) form.reset();
      setOpen(false);
    },
    onError: (err) => form.setError("root", { message: err.message }),
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent>
        <form onSubmit={form.handleSubmit((v) => simpan.mutate(v))} noValidate className="gap-5 flex flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>{t(siswa ? "siswa.edit" : "siswa.add")}</SheetTitle>
            <SheetDescription>{t(siswa ? "siswa.sheet.editDescription" : "siswa.sheet.description")}</SheetDescription>
          </SheetHeader>
          <FormField id="siswa-nama" label={t("auth.name")} required error={fieldError(errors.nama)}>
            {(control) => (
              <Input {...control} autoComplete="off" className="min-h-11" data-tour="siswa-tambahNama" {...form.register("nama")} />
            )}
          </FormField>
          <FormField
            id="siswa-kelas"
            label={t("common.columns.kelas")}
            required
            hint={t("siswa.sheet.kelasHint")}
            error={fieldError(errors.kelas)}
          >
            {(control) => (
              <Input {...control} autoComplete="off" className="min-h-11" data-tour="siswa-tambahKelas" {...form.register("kelas")} />
            )}
          </FormField>
          {errors.root && (
            <p role="alert" className="text-sm text-danger">
              {errors.root.message}
            </p>
          )}
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline" className="min-h-11">
                {t("common.cancel")}
              </Button>
            </SheetClose>
            <Button type="submit" loading={simpan.isPending} className="min-h-11" data-tour="siswa-tambahSimpan">
              {t("common.save")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
