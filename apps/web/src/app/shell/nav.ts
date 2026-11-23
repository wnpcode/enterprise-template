import { BarChart3, Building2, LayoutDashboard, LayoutGrid, Settings, Users, type LucideIcon } from "lucide-react";
import { hasRole, type User } from "../../features/auth";

/**
 * `label` adalah kunci terjemahan; komponen shell merendernya dengan `t(label)`.
 * `children` membuat node jadi grup (tanpa halaman sendiri) dan boleh bersarang lebih dari satu tingkat; anjuran UX maksimal 3 tingkat.
 * `to` sebuah grup adalah awalan path semua turunannya (`/app/reporting` untuk `/app/reporting/keuangan/pajak`): dipakai untuk status aktif dan label tab.
 * `icon` hanya dipakai di tingkat teratas. `shortLabel` dipakai header horizontal dan bottom nav yang sempit.
 * `roles` berlaku di tingkat mana pun; grup yang semua anaknya tersaring ikut hilang.
 */
export type NavNode = {
  to: string;
  label: string;
  shortLabel?: string;
  icon?: LucideIcon;
  end?: boolean;
  roles?: string[];
  children?: NavNode[];
};
export type NavItem = NavNode & { icon: LucideIcon };

// satu-satunya tempat menambah tujuan navigasi; dipakai Sidebar, Topbar (horizontal), BottomNav lewat visibleNavItems.
// Urutan penting: bottom nav hanya menampilkan beberapa item pertama (sisanya di tombol Menu) dan header menyisakan yang terakhir ke "Lainnya".
export const navItems: NavItem[] = [
  { to: "/app", label: "nav.dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/siswa", label: "nav.siswa", icon: Users },
  {
    to: "/app/reporting",
    label: "nav.reporting",
    icon: BarChart3,
    children: [
      { to: "/app/reporting/siswa", label: "nav.reportingSiswa" },
      { to: "/app/reporting/pendaftaran", label: "nav.reportingPendaftaran" },
    ],
  },
  {
    to: "/app/konfigurasi-company",
    label: "nav.konfigurasiCompany",
    shortLabel: "nav.konfigurasiShort",
    icon: Building2,
    roles: ["admin", "superadmin"],
  },
  { to: "/app/komponen", label: "nav.komponen", icon: LayoutGrid, roles: ["admin", "superadmin"] },
  { to: "/app/pengaturan", label: "nav.pengaturan", icon: Settings },
];

/** Buang node yang tidak boleh dilihat `user`, rekursif; grup tanpa anak yang tersisa ikut dibuang. */
export function pruneNav<T extends NavNode>(nodes: T[], user: User | null): T[] {
  return nodes.flatMap((n) => {
    if (!hasRole(user, n.roles)) return [];
    if (!n.children) return [n];
    const children = pruneNav(n.children, user);
    return children.length ? [{ ...n, children }] : [];
  });
}

export const visibleNavItems = (user: User | null) => pruneNav(navItems, user);

/** Semua node (termasuk grup dan turunannya) dalam satu daftar rata. */
export const flattenNav = (nodes: NavNode[]): NavNode[] => nodes.flatMap((n) => [n, ...flattenNav(n.children ?? [])]);
