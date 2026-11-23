import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@enterprise/design-system";

// shortcut: isi cuplikan tertulis tetap (Indonesia) seperti halaman demo; slug harus sama dengan registry demos
const PREVIEWS: { slug: string; title: string; preview: ReactNode }[] = [
  {
    slug: "button",
    title: "Button",
    preview: (
      <div className="gap-2 flex flex-wrap">
        <Button size="sm">Simpan</Button>
        <Button size="sm" variant="outline">
          Batal
        </Button>
      </div>
    ),
  },
  {
    slug: "badge",
    title: "Badge",
    preview: (
      <div className="gap-2 flex flex-wrap">
        <Badge variant="success">Aktif</Badge>
        <Badge variant="warning">Menunggu</Badge>
        <Badge variant="danger">Ditolak</Badge>
      </div>
    ),
  },
  {
    slug: "input",
    title: "Input",
    preview: <Input aria-label="Cari kelas" placeholder="Cari kelas" />,
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    preview: (
      <div className="gap-2 flex items-center">
        <Checkbox id="dash-preview-hadir" defaultChecked />
        <Label htmlFor="dash-preview-hadir">Hadir</Label>
      </div>
    ),
  },
  {
    slug: "switch",
    title: "Switch",
    preview: (
      <div className="gap-3 flex items-center">
        <Switch id="dash-preview-notif" defaultChecked />
        <Label htmlFor="dash-preview-notif">Notifikasi wali</Label>
      </div>
    ),
  },
  {
    slug: "tabs",
    title: "Tabs",
    preview: (
      <Tabs defaultValue="profil">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="nilai">Nilai</TabsTrigger>
        </TabsList>
        <TabsContent value="profil">
          <p className="text-sm">Data diri dan kontak wali.</p>
        </TabsContent>
        <TabsContent value="nilai">
          <p className="text-sm">Rekap nilai semester ini.</p>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    slug: "alert",
    title: "Alert",
    preview: (
      <Alert variant="info" title="Info">
        Ujian semester dimulai Senin.
      </Alert>
    ),
  },
  {
    slug: "avatar",
    title: "Avatar",
    preview: (
      <div className="gap-2 flex items-center">
        <Avatar name="Budi Guru" size="sm" />
        <Avatar name="Siti Aminah" size="md" />
        <Avatar name="Rizky Pratama" size="lg" />
      </div>
    ),
  },
];

export function KomponenPreview() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="dash-preview" className="space-y-4">
      <div className="space-y-1">
        <h2 id="dash-preview" className="text-lg font-semibold">
          {t("dashboard.preview.title")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("dashboard.preview.description")}</p>
      </div>
      <div className="gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 grid">
        {PREVIEWS.map(({ slug, title, preview }) => (
          <div key={slug} className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-medium">{title}</h3>
            <div className="min-h-16">{preview}</div>
            <Link
              to={`/app/komponen/${slug}`}
              className="min-h-11 text-sm inline-flex items-center text-primary underline-offset-4 hover:underline"
            >
              {t("dashboard.preview.open", { nama: title })}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
