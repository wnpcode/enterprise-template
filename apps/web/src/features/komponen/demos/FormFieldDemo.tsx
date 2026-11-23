import { FormField, Input, Textarea } from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

export function FormFieldDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Default dengan hint">
        <FormField id="ff-email" label="Email wali" required hint="Pakai email yang aktif untuk menerima pengumuman." className="max-w-sm">
          {(control) => <Input {...control} type="email" placeholder="nama@contoh.id" />}
        </FormField>
      </DemoSection>

      <DemoSection title="Error">
        <FormField id="ff-nisn" label="NISN" required error="NISN harus 10 digit." className="max-w-sm">
          {(control) => <Input {...control} defaultValue="12345" inputMode="numeric" />}
        </FormField>
      </DemoSection>

      <DemoSection title="Dengan Textarea">
        <FormField id="ff-catatan" label="Catatan" hint="Maksimal 500 karakter." className="max-w-sm">
          {(control) => <Textarea {...control} rows={3} />}
        </FormField>
      </DemoSection>
    </div>
  );
}
