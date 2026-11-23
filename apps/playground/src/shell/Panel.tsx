import type { ReactNode } from "react";
import { Label, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Switch } from "@wnpcode/design-system";
import { Segmented, type Option, type PlaygroundSkin } from "../ConfigBar";
import type { ChromeStyle, HeaderConfig, ShellConfig, SidebarConfig, Tone } from "./config";
import { matchPreset, PRESETS, type PresetId } from "./presets";

type PanelProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  brand: boolean;
  onBrandChange: (next: boolean) => void;
  skin: PlaygroundSkin;
  onSkinChange: (next: PlaygroundSkin) => void;
  config: ShellConfig;
  onConfigChange: (next: ShellConfig) => void;
};

const skinOptions: Option<PlaygroundSkin>[] = [
  { value: "flat", label: "Flat", content: "Flat" },
  { value: "neo", label: "Neo", content: "Neo" },
  { value: "glass", label: "Glass", content: "Glass" },
  { value: "clay", label: "Clay", content: "Clay" },
  { value: "fluid", label: "Fluid", content: "Fluid" },
  { value: "aurora", label: "Aurora", content: "Aurora" },
  { value: "swiss", label: "Swiss", content: "Swiss" },
];

function dot(color: string) {
  return <span aria-hidden="true" className="size-3 rounded-full border border-border" style={{ background: color }} />;
}

const toneOptions: Option<Tone>[] = [
  { value: "default", label: "Default", content: <>{dot("var(--ds-color-surface)")}Default</> },
  { value: "muted", label: "Muted", content: <>{dot("var(--ds-slate-200)")}Muted</> },
  { value: "inverse", label: "Inverse", content: <>{dot("var(--ds-slate-900)")}Inverse</> },
  { value: "primary", label: "Primary", content: <>{dot("var(--ds-color-primary)")}Primary</> },
];

const styleOptions: Option<ChromeStyle>[] = [
  { value: "solid", label: "Solid", content: "Solid" },
  { value: "bordered", label: "Bordered", content: "Bordered" },
  { value: "transparent", label: "Transparent", content: "Transparent" },
];

const headerTypeOptions: Option<HeaderConfig["type"]>[] = [
  { value: "sticky", label: "Sticky", content: "Sticky" },
  { value: "static", label: "Static", content: "Static" },
  { value: "floating", label: "Floating", content: "Floating" },
];
const headerSpanOptions: Option<HeaderConfig["span"]>[] = [
  { value: "full", label: "Melintang", content: "Melintang" },
  { value: "inset", label: "Di samping sidebar", content: "Di samping sidebar" },
];
const sidebarTypeOptions: Option<SidebarConfig["type"]>[] = [
  { value: "full", label: "Full", content: "Full" },
  { value: "floating", label: "Floating", content: "Floating" },
];
const sidebarSideOptions: Option<SidebarConfig["side"]>[] = [
  { value: "left", label: "Kiri", content: "Kiri" },
  { value: "right", label: "Kanan", content: "Kanan" },
];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 pt-4 first:pt-0 border-t border-border first:border-t-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SwitchRow({
  id,
  label,
  checked,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="gap-2 flex items-center">
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

export function ShellPanel({ open, onOpenChange, brand, onBrandChange, skin, onSkinChange, config, onConfigChange }: PanelProps) {
  const { sidebar: s, header: h } = config;
  const setHeader = (patch: Partial<HeaderConfig>) => onConfigChange({ ...config, header: { ...h, ...patch } });
  const setSidebar = (patch: Partial<SidebarConfig>) => onConfigChange({ ...config, sidebar: { ...s, ...patch } });
  const toneHint = "Warna preset hanya berlaku di style Solid.";
  const presetOptions: Option<PresetId | "custom">[] = [
    ...PRESETS.map((p) => ({ value: p.id, label: p.label, content: p.label })),
    ...(matchPreset(config) === "custom" ? [{ value: "custom" as const, label: "Kustom", content: "Kustom" }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Kustomisasi</SheetTitle>
          <SheetDescription>Berlaku di playground dan di section App shell.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 space-y-5 pr-1 flex-1 overflow-y-auto">
          <Group title="Preset">
            <Field label="Tema layout" hint="Mengubah pengaturan di bawah satu per satu menjadikan preset Kustom.">
              <Segmented
                label="Preset layout"
                value={matchPreset(config)}
                options={presetOptions}
                onChange={(id) => {
                  const chosen = PRESETS.find((p) => p.id === id);
                  if (chosen) onConfigChange(chosen.config);
                }}
              />
            </Field>
          </Group>

          <Group title="Tampilan">
            <Field label="Skin">
              <Segmented label="Skin" value={skin} options={skinOptions} onChange={onSkinChange} />
            </Field>
            <SwitchRow id="panel-brand" label="Brand acme" checked={brand} onChange={onBrandChange} />
          </Group>

          <Group title="Header">
            <SwitchRow
              id="header-visible"
              label="Tampilkan header"
              checked={h.visible}
              disabled={h.visible && !s.visible}
              onChange={(visible) => setHeader({ visible })}
            />
            <Field label="Tipe">
              <Segmented
                label="Tipe header"
                value={h.type}
                options={headerTypeOptions}
                onChange={(type) => setHeader({ type })}
                disabled={!h.visible}
              />
            </Field>
            <Field label="Posisi">
              <Segmented
                label="Posisi header"
                value={h.span}
                options={headerSpanOptions}
                onChange={(span) => setHeader({ span })}
                disabled={!h.visible}
              />
            </Field>
            <Field label="Style">
              <Segmented
                label="Style header"
                value={h.style}
                options={styleOptions}
                onChange={(style) => setHeader({ style })}
                disabled={!h.visible}
              />
            </Field>
            <Field label="Warna" hint={toneHint}>
              <Segmented
                label="Warna header"
                value={h.tone}
                options={toneOptions}
                onChange={(tone) => setHeader({ tone })}
                disabled={!h.visible || h.style !== "solid"}
              />
            </Field>
          </Group>

          <Group title="Sidebar">
            <SwitchRow
              id="sidebar-visible"
              label="Tampilkan sidebar"
              checked={s.visible}
              disabled={s.visible && !h.visible}
              onChange={(visible) => setSidebar({ visible })}
            />
            <Field label="Tipe">
              <Segmented
                label="Tipe sidebar"
                value={s.type}
                options={sidebarTypeOptions}
                onChange={(type) => setSidebar({ type })}
                disabled={!s.visible}
              />
            </Field>
            <SwitchRow
              id="sidebar-collapsed"
              label="Mode ikon (ciut)"
              checked={s.collapsed}
              disabled={!s.visible}
              onChange={(collapsed) => setSidebar({ collapsed })}
            />
            <Field label="Posisi">
              <Segmented
                label="Posisi sidebar"
                value={s.side}
                options={sidebarSideOptions}
                onChange={(side) => setSidebar({ side })}
                disabled={!s.visible}
              />
            </Field>
            <Field label="Style">
              <Segmented
                label="Style sidebar"
                value={s.style}
                options={styleOptions}
                onChange={(style) => setSidebar({ style })}
                disabled={!s.visible}
              />
            </Field>
            <Field label="Warna" hint={toneHint}>
              <Segmented
                label="Warna sidebar"
                value={s.tone}
                options={toneOptions}
                onChange={(tone) => setSidebar({ tone })}
                disabled={!s.visible || s.style !== "solid"}
              />
            </Field>
          </Group>
        </div>
      </SheetContent>
    </Sheet>
  );
}
