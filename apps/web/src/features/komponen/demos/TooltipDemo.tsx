import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@enterprise/design-system";
import { DemoSection } from "../DemoSection";

const sides = [
  { side: "top", label: "Atas" },
  { side: "right", label: "Kanan" },
  { side: "bottom", label: "Bawah" },
  { side: "left", label: "Kiri" },
] as const;

export function TooltipDemo() {
  return (
    <div className="space-y-8">
      <DemoSection title="Pada Button">
        <p className="text-sm text-muted-foreground">Arahkan kursor atau fokuskan tombol dengan Tab.</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Unduh rapor</Button>
          </TooltipTrigger>
          <TooltipContent>Format PDF, maks 2 MB</TooltipContent>
        </Tooltip>
      </DemoSection>

      <DemoSection title="Posisi (side)">
        <div className="gap-6 py-10 flex flex-wrap justify-center">
          {sides.map(({ side, label }) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button size="sm" variant="secondary" className="min-h-11">
                  {label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>Muncul di sisi {label.toLowerCase()}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Catatan penggunaan">
        <p className="text-sm text-muted-foreground">
          Tooltip hanya untuk elemen interaktif seperti tombol dan tautan, karena hanya elemen itu yang bisa menerima fokus keyboard. Jangan
          taruh informasi penting di dalamnya, dan jangan pasang pada teks biasa.
        </p>
      </DemoSection>
    </div>
  );
}
