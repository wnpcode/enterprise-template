import { useState } from "react";
import { Badge, Button, useToast } from "@wnp_code/design-system";
import { Demo, Section } from "../../Section";

export function ButtonSection() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  return (
    <Section id="button" title="Button" description="Satu aksi utama per area; sisanya secondary, outline, atau ghost.">
      <Demo label="Varian">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Demo>
      <Demo label="Ukuran">
        <Button size="sm">Kecil</Button>
        <Button size="md">Sedang</Button>
        <Button size="lg">Besar</Button>
      </Demo>
      <Demo label="State">
        <Button disabled>Disabled</Button>
        <Button
          loading={saving}
          onClick={() => {
            setSaving(true);
            setTimeout(() => {
              setSaving(false);
              toast({ title: "Profil tersimpan", description: "Perubahan tampil di halaman publik.", variant: "success" });
            }, 800);
          }}
        >
          Simpan
        </Button>
      </Demo>
    </Section>
  );
}

export function BadgeSection() {
  return (
    <Section id="badge" title="Badge" description="Label status singkat. Selalu sertakan teks, jangan hanya warna.">
      <Demo label="Varian" className="gap-2">
        <Badge>Neutral</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Aktif</Badge>
        <Badge variant="warning">Menunggu</Badge>
        <Badge variant="danger">Ditolak</Badge>
        <Badge variant="info">Baru</Badge>
      </Demo>
    </Section>
  );
}
