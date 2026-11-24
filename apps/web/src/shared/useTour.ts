import { useState } from "react";
import type { TourStep } from "@wnp_code/design-system";

export const TOUR_STORAGE_KEY = "web-tour-seen";
/** Isi `web-tour-seen` yang mematikan semua tur otomatis (dipakai test; nanti bisa jadi opsi "jangan tampilkan lagi"). */
export const ALL_TOURS_SEEN = "*";

/** `feature` mencatat apakah fitur itu sudah dikenalkan ke pengguna; satu fitur boleh punya beberapa step. */
export type PageTourStep = TourStep & { feature: string };

function readSeen(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function markSeen(ids: string[]) {
  try {
    const seen = readSeen();
    const next = [...new Set([...seen, ...ids])];
    if (next.length !== seen.length) localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // tur tetap tertutup untuk sesi ini; hanya muncul lagi setelah reload
  }
}

/**
 * Tur satu halaman dengan status "sudah dilihat" per fitur. Terbuka sendiri (setelah `ready`) hanya dengan step fitur yang
 * belum pernah dilihat, jadi fitur baru di halaman lama tampil tanpa mengulang yang sudah dikenal. `start` memutar semua step.
 * Fitur baru: tambah step dengan `feature` baru. Isi fitur berubah: ganti `feature`-nya (`siswa-aksi-v2`).
 * shortcut: status hanya di localStorage, jadi tur muncul lagi di browser atau device lain; pindah ke profil akun bila mengganggu.
 */
export function useTour(steps: PageTourStep[], { ready }: { ready: boolean }) {
  const [seen, setSeen] = useState(readSeen);
  const [manual, setManual] = useState(false);
  const unseen = seen.includes(ALL_TOURS_SEEN) ? [] : steps.filter((s) => !seen.includes(s.feature));
  const open = manual || (ready && unseen.length > 0);
  // step yang diputar tidak berubah selama tur terbuka: status baru ditulis saat ditutup
  const playing = manual ? steps : unseen;

  const onOpenChange = (next: boolean) => {
    setManual(next);
    if (next) return;
    const ids = [...new Set(playing.map((s) => s.feature))];
    markSeen(ids);
    setSeen((prev) => [...prev, ...ids]);
  };

  return { open, steps: playing, onOpenChange, start: () => setManual(true) };
}
