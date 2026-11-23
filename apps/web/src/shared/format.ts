import i18n from "../app/i18n";

export const formatTanggal = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(i18n.language === "en" ? "en-GB" : "id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
