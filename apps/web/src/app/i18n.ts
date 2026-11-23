import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import en from "../locales/en.json";
import id from "../locales/id.json";
import { env } from "./env";

export const LANGUAGES = ["id", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export const LANG_STORAGE_KEY = "web-lang";
export const LANGUAGE_NAMES: Record<Language, string> = { id: "Bahasa Indonesia", en: "English" };

const isLanguage = (v: string): v is Language => (LANGUAGES as readonly string[]).includes(v);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { id: { translation: id }, en: { translation: en } },
    fallbackLng: "id",
    supportedLngs: LANGUAGES,
    // hanya pilihan eksplisit pengguna; bahasa browser diabaikan agar default tetap id
    detection: { order: ["localStorage"], lookupLocalStorage: LANG_STORAGE_KEY, caches: ["localStorage"] },
    interpolation: { escapeValue: false, defaultVariables: { appName: env.VITE_APP_NAME } },
  });

const zodLocales = { id: z.locales.id, en: z.locales.en };

// atribut lang dokumen dan pesan bawaan zod mengikuti bahasa aktif
function applyLanguage(lng: string) {
  const lang = isLanguage(lng) ? lng : "id";
  document.documentElement.lang = lang;
  z.config(zodLocales[lang]());
}
applyLanguage(i18n.language);
i18n.on("languageChanged", applyLanguage);

export default i18n;
