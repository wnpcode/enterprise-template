import type { Siswa, SiswaStatus } from "./api";

const NAMA = [
  "Aisyah Putri",
  "Bagas Pratama",
  "Citra Lestari",
  "Dimas Saputra",
  "Eka Rahmawati",
  "Fajar Nugroho",
  "Gita Permata",
  "Hadi Kurniawan",
  "Intan Maharani",
  "Joko Santoso",
  "Kirana Dewi",
  "Lukman Hakim",
  "Mega Anggraini",
  "Naufal Ramadhan",
  "Oktavia Sari",
  "Putra Wijaya",
  "Qori Amalia",
  "Rizky Firmansyah",
  "Salsabila Azzahra",
  "Taufik Hidayat",
  "Umi Kalsum",
  "Vina Melati",
  "Wahyu Setiawan",
];
const KELAS = ["X IPA 1", "X IPA 2", "X IPS 1", "XI IPA 1", "XI IPS 2", "XII IPA 1"];
const STATUS: SiswaStatus[] = ["Aktif", "Aktif", "Menunggu", "Aktif", "Ditolak", "Menunggu"];

// data contoh untuk MSW (src/mocks) dan tampilan statis (landing, demo Table); bukan sumber data halaman
export const siswaContoh: Siswa[] = NAMA.map((nama, i) => ({
  id: i + 1,
  nama,
  kelas: KELAS[i % KELAS.length],
  status: STATUS[i % STATUS.length],
  terdaftar: `2026-07-${String((i % 28) + 1).padStart(2, "0")}`,
}));
