import { Avatar } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

export function AvatarDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Ukuran">
        <div className="gap-3 flex items-center">
          <Avatar name="Budi Guru" size="sm" />
          <Avatar name="Budi Guru" size="md" />
          <Avatar name="Budi Guru" size="lg" />
        </div>
      </DemoSection>
      <DemoSection title="Di sebelah nama">
        <p className="gap-2 text-sm flex items-center">
          <Avatar name="Rina Admin" size="sm" alt="" />
          Rina Admin
        </p>
      </DemoSection>
      <DemoSection title="Gambar gagal dimuat">
        <Avatar name="Siti Baru" src="/tidak-ada.png" />
      </DemoSection>
    </div>
  );
}
