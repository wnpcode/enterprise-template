import { useState } from "react";
import { Avatar, Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@enterprise/design-system";
import { Section } from "../../Section";
import { useShell } from "../../shell/config";
import { icons } from "../../shell/icons";
import { NavLinkItem, Shell } from "../../shell/Shell";

const items = [
  { id: "dashboard", label: "Dashboard", icon: icons.home },
  { id: "siswa", label: "Siswa", icon: icons.users },
  { id: "pengaturan", label: "Pengaturan", icon: icons.settings },
];

const siswa = [
  "Aisyah Putri",
  "Bagas Pratama",
  "Citra Lestari",
  "Dimas Saputra",
  "Eka Wijaya",
  "Fajar Nugroho",
  "Gita Anjani",
  "Hana Salsabila",
].map((nama, i) => ({ nama, kelas: ["7A", "7B", "8A", "9A"][i % 4], status: (["Aktif", "Menunggu", "Ditolak"] as const)[i % 3] }));
const statusVariant = { Aktif: "success", Menunggu: "warning", Ditolak: "danger" } as const;

export function AppShellSection() {
  const { config, setConfig, openPanel } = useShell();
  const [active, setActive] = useState("siswa");
  const tooltipSide = config.sidebar.side === "left" ? "right" : "left";
  const current = items.find((i) => i.id === active)?.label ?? "";

  return (
    <Section
      id="app-shell"
      title="App shell"
      description="Sidebar dan header pada app contoh. Konfigurasi dari panel Kustomisasi berlaku di sini dan di halaman ini. Header Transparent yang menempel akan menimpa konten saat di-scroll."
    >
      <div className="space-y-3">
        <Button variant="outline" size="sm" onClick={openPanel}>
          {icons.sliders}
          Buka pengaturan
        </Button>
        <Shell
          config={config}
          onCollapsedChange={(collapsed) => setConfig({ ...config, sidebar: { ...config.sidebar, collapsed } })}
          title="Portal Sekolah"
          navLabel="Navigasi contoh"
          frameHeight="30rem"
          nav={(collapsed) => (
            <ul className="space-y-1">
              {items.map((i) => (
                <li key={i.id}>
                  <NavLinkItem
                    icon={i.icon}
                    label={i.label}
                    collapsed={collapsed}
                    tooltipSide={tooltipSide}
                    active={active === i.id}
                    onClick={() => setActive(i.id)}
                  />
                </li>
              ))}
            </ul>
          )}
          headerContent={
            <div className="gap-2 flex items-center">
              <Avatar name="Budi Guru" size="sm" alt="" />
              <span className="text-sm sm:inline hidden">Budi Guru</span>
            </div>
          }
        >
          <div className="space-y-4 p-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{current}</h3>
              <p className="text-sm text-muted-foreground">Gulir untuk melihat perilaku header dan sidebar menempel.</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...siswa, ...siswa].map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{s.nama}</TableCell>
                    <TableCell>{s.kelas}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Shell>
      </div>
    </Section>
  );
}
