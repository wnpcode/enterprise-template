import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@enterprise/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { deleteSiswa, siswaKeys, type Siswa } from "./api";

type Props = { siswa: Siswa | null; onClose: () => void; onDeleted?: () => void };

export function HapusSiswaDialog({ siswa, onClose, onDeleted }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const hapus = useMutation({
    mutationFn: (id: number) => deleteSiswa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siswaKeys.all });
      toast({ title: t("siswa.delete.done"), description: siswa?.nama, variant: "success" });
      onDeleted?.();
      onClose();
    },
    onError: (err) => toast({ title: t("siswa.delete.error"), description: err.message, variant: "danger" }),
  });

  return (
    <Dialog open={siswa !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("siswa.delete.title")}</DialogTitle>
          <DialogDescription>{t("siswa.delete.text", { nama: siswa?.nama })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="min-h-11">
              {t("common.cancel")}
            </Button>
          </DialogClose>
          <Button variant="danger" className="min-h-11" loading={hapus.isPending} onClick={() => siswa && hapus.mutate(siswa.id)}>
            {t("siswa.delete.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
