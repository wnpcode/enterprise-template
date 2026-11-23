import { Badge } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

export function BadgeDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Variant">
        <div className="gap-2 flex flex-wrap">
          <Badge variant="neutral">Draf</Badge>
          <Badge variant="primary">Baru</Badge>
          <Badge variant="success">Aktif</Badge>
          <Badge variant="warning">Menunggu</Badge>
          <Badge variant="danger">Ditolak</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </DemoSection>

      <DemoSection title="Dalam kalimat">
        <p className="text-sm">
          Status pendaftaran: <Badge variant="warning">Menunggu</Badge>
        </p>
      </DemoSection>
    </div>
  );
}
