import { Skeleton } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

export function SkeletonDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Baris teks">
        <div className="max-w-md space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </DemoSection>

      <DemoSection title="Baris daftar siswa">
        <div className="max-w-md divide-y divide-border rounded-md border border-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="gap-3 p-3 flex items-center">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Catatan aksesibilitas">
        <p className="text-sm text-muted-foreground">
          Skeleton bersifat aria-hidden. Status memuat harus disampaikan elemen lain, misalnya Spinner dengan label atau teks &quot;Memuat
          daftar siswa&quot; pada wilayah yang sama.
        </p>
      </DemoSection>
    </div>
  );
}
