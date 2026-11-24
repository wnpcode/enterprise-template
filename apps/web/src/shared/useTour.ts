import { useState } from "react";
import type { TourStep } from "@wnp_code/design-system";
import { version as packageVersion } from "../../package.json";
import { RELEASES, compareVersions, featureVersion, type FeatureId } from "./releases";

export const TOUR_STORAGE_KEY = "web-tour-version";
/** Kunci halaman yang berarti "semua halaman sudah dilihat sampai versi ini" (dipakai test dan e2e). */
export const ALL_PAGES = "*";

// Di dev server, e2e, dan vitest tur berjalan sebagai rilis terbaru di registry agar fitur yang belum dirilis bisa dikembangkan
// dan dites; di build produksi yang berlaku versi package.json, jadi tur fitur baru baru muncul setelah versinya dideploy.
export const APP_VERSION = import.meta.env.DEV ? RELEASES[0].version : packageVersion;

/** `feature` menunjuk fitur di RELEASES (dan dengan itu versinya); satu fitur boleh punya beberapa step. */
export type PageTourStep = TourStep & { feature: FeatureId };

/**
 * Step yang perlu diputar: fiturnya sudah dideploy (versi <= `current`) dan, kecuali `all`, belum pernah dilihat
 * (pengguna baru tanpa catatan melihat semuanya; pengguna lama hanya fitur yang lebih baru dari versi terakhir yang ia lihat).
 */
export function selectTourSteps(
  steps: PageTourStep[],
  { seen, current, all = false }: { seen?: string; current: string; all?: boolean },
): PageTourStep[] {
  return steps.filter((s) => {
    const since = featureVersion(s.feature);
    if (compareVersions(since, current) > 0) return false;
    return all || !seen || compareVersions(since, seen) > 0;
  });
}

function readAll(): Record<string, string> {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) ?? "{}");
    if (typeof v !== "object" || v === null || Array.isArray(v)) return {};
    return Object.fromEntries(Object.entries(v).filter((e): e is [string, string] => typeof e[1] === "string"));
  } catch {
    return {};
  }
}

function writeSeen(page: string, version: string) {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify({ ...readAll(), [page]: version }));
  } catch {
    // tur tetap tertutup untuk sesi ini; hanya muncul lagi setelah reload
  }
}

/**
 * Tur satu halaman per versi rilis. Terbuka sendiri (setelah `ready`) hanya dengan fitur yang belum pernah dilihat pengguna;
 * saat ditutup, versi terakhir yang dilihat di halaman ini diisi versi sekarang. `start` memutar semua fitur yang sudah dideploy.
 * shortcut: status hanya di localStorage, jadi tur muncul lagi di browser atau device lain; pindah ke profil akun bila mengganggu.
 */
export function useTour(page: string, steps: PageTourStep[], { ready, version = APP_VERSION }: { ready: boolean; version?: string }) {
  const [seen, setSeen] = useState(() => {
    const all = readAll();
    return all[page] ?? all[ALL_PAGES];
  });
  const [manual, setManual] = useState(false);
  const unseen = selectTourSteps(steps, { seen, current: version });
  const open = manual || (ready && unseen.length > 0);
  // step yang diputar tidak berubah selama tur terbuka: versi terlihat baru ditulis saat ditutup
  const playing = manual ? selectTourSteps(steps, { current: version, all: true }) : unseen;

  const onOpenChange = (next: boolean) => {
    setManual(next);
    if (next) return;
    writeSeen(page, version);
    setSeen(version);
  };

  return { open, steps: playing, onOpenChange, start: () => setManual(true) };
}
