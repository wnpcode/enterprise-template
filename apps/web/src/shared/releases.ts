/**
 * Fitur yang diperkenalkan tiap versi rilis, terbaru di atas. Satu-satunya tempat yang menyatakan "fitur X masuk di versi Y".
 * Fitur baru: tambah changeset `web` (minor), tulis versi hasilnya di baris teratas, lalu pakai id-nya di step tur.
 */
export const RELEASES = [
  { version: "0.2.0", features: ["siswa-tambah"] },
  { version: "0.1.0", features: ["siswa-cari", "siswa-aksi"] },
] as const;

export type FeatureId = (typeof RELEASES)[number]["features"][number];

export function featureVersion(id: FeatureId): string {
  const release = RELEASES.find((r) => (r.features as readonly string[]).includes(id));
  if (!release) throw new Error(`Fitur "${id}" belum terdaftar di RELEASES`);
  return release.version;
}

// shortcut: hanya angka mayor.minor.patch, sufiks prerelease (-next.1) diabaikan; pakai paket semver bila perlu aturan penuh
const parts = (v: string) => v.split("-")[0].split(".").map(Number);

/** Negatif bila a < b, nol bila sama, positif bila a > b. */
export function compareVersions(a: string, b: string): number {
  const x = parts(a);
  const y = parts(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}
