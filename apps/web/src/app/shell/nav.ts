import { LayoutDashboard, LayoutGrid, Settings, Users, type LucideIcon } from "lucide-react";
import { hasRole, type User } from "../../features/auth";

/** `label` adalah kunci terjemahan; komponen shell merendernya lewat `t(label)`. */
export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean; roles?: string[] };

// satu-satunya tempat menambah tujuan navigasi; dipakai Sidebar, Topbar (horizontal), BottomNav lewat visibleNavItems
export const navItems: NavItem[] = [
  { to: "/app", label: "nav.dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/siswa", label: "nav.siswa", icon: Users },
  { to: "/app/komponen", label: "nav.komponen", icon: LayoutGrid, roles: ["admin"] },
  { to: "/app/pengaturan", label: "nav.pengaturan", icon: Settings },
];

export const visibleNavItems = (user: User | null) => navItems.filter((item) => hasRole(user, item.roles));
