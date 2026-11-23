import { useTranslation } from "react-i18next";

/** Pesan di schema zod ditulis sebagai kunci terjemahan; hook ini menerjemahkannya untuk prop `error` FormField. */
export function useFieldError() {
  const { t } = useTranslation();
  return (field?: { message?: string }) => (field?.message ? t(field.message) : undefined);
}
