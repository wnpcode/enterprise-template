import { Badge } from "@wnp_code/design-system";
import { useTranslation } from "react-i18next";
import type { SiswaStatus } from "./api";

const variants = { Aktif: "success", Menunggu: "warning", Ditolak: "danger" } as const;

export function StatusBadge({ status }: { status: SiswaStatus }) {
  const { t } = useTranslation();
  return <Badge variant={variants[status]}>{t(`status.${status}`)}</Badge>;
}
