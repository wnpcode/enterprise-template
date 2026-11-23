import { useState } from "react";
import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wnp_code/design-system";
import { DemoSection } from "../DemoSection";

const KELAS = ["X IPA 1", "X IPA 2", "X IPS 1", "XI IPA 1", "XI IPS 2", "XII IPA 1"];
const SEMUA = "semua";

export function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(SEMUA);
  const [applied, setApplied] = useState(SEMUA);

  return (
    <div className="space-y-8">
      <DemoSection title="Filter kelas">
        <p className="text-sm text-muted-foreground">Popover terkontrol: tombol Terapkan menutup panel dan menyimpan pilihan.</p>
        <div className="gap-4 flex flex-wrap items-center">
          <Popover
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              if (next) setDraft(applied);
            }}
          >
            <PopoverTrigger asChild>
              <Button variant="outline">Filter</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="space-y-4 max-w-[calc(100vw-2rem)]">
              <div className="space-y-2">
                <Label htmlFor="popover-kelas">Kelas</Label>
                <Select value={draft} onValueChange={setDraft}>
                  <SelectTrigger id="popover-kelas">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SEMUA}>Semua kelas</SelectItem>
                    {KELAS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setApplied(draft);
                  setOpen(false);
                }}
              >
                Terapkan
              </Button>
            </PopoverContent>
          </Popover>
          <p className="text-sm" aria-live="polite">
            Filter: {applied === SEMUA ? "semua kelas" : `kelas ${applied}`}
          </p>
        </div>
      </DemoSection>
    </div>
  );
}
