import { useEffect, useState } from "react";
import { Button, Input, Spinner } from "@wnpcode/design-system";
import { Demo, Section } from "../Section";

/* Baca nilai terhitung custom property di <html>; dibaca ulang saat theme/brand/skin berganti. */
function readVars(names: string[]): Record<string, string> {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n).trim()]));
}

function useRootVars(names: string[]) {
  const [values, setValues] = useState(() => readVars(names));
  useEffect(() => {
    const update = () => setValues(readVars(names));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-brand", "data-skin"] });
    return () => observer.disconnect();
  }, [names]);
  return values;
}

const semanticGroups: { label: string; tokens: string[] }[] = [
  {
    label: "Permukaan dan teks",
    tokens: [
      "background",
      "foreground",
      "surface",
      "surface-foreground",
      "surface-elevated",
      "muted",
      "muted-foreground",
      "border",
      "input",
      "ring",
    ],
  },
  { label: "Aksi", tokens: ["primary", "primary-foreground", "primary-hover", "secondary", "secondary-foreground", "secondary-hover"] },
  { label: "Sukses", tokens: ["success", "success-foreground", "success-subtle", "success-subtle-fg"] },
  { label: "Peringatan", tokens: ["warning", "warning-foreground", "warning-subtle", "warning-subtle-fg"] },
  { label: "Bahaya", tokens: ["danger", "danger-foreground", "danger-hover", "danger-subtle", "danger-subtle-fg"] },
  { label: "Info", tokens: ["info", "info-foreground", "info-subtle", "info-subtle-fg"] },
];
const colorVarNames = semanticGroups.flatMap((g) => g.tokens).map((t) => `--ds-color-${t}`);

const scales = ["blue", "slate", "green", "amber", "red", "sky"];
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function ColorSection() {
  const values = useRootVars(colorVarNames);
  return (
    <Section
      id="warna"
      title="Warna"
      description="Komponen hanya memakai token semantik. Nilai di bawah dibaca langsung dari tema aktif, jadi berubah saat tema, skin, atau brand diganti."
    >
      {semanticGroups.map((group) => (
        <Demo key={group.label} label={group.label} className="gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4 grid grid-cols-2">
          {group.tokens.map((token) => (
            <div key={token} className="min-w-0 space-y-1.5">
              <div className="h-12 rounded-md border border-border" style={{ background: `var(--ds-color-${token})` }} />
              <div className="text-xs">
                <code className="font-medium block truncate font-mono">{token}</code>
                <span className="block truncate font-mono text-muted-foreground">{values[`--ds-color-${token}`]}</span>
              </div>
            </div>
          ))}
        </Demo>
      ))}
      <Demo label="Skala primitif (--ds-{warna}-{shade})" className="space-y-3 block">
        {scales.map((scale) => (
          <div key={scale} className="gap-3 grid grid-cols-[3.5rem_1fr] items-center">
            <span className="text-xs font-medium">{scale}</span>
            <div className="gap-1 grid grid-cols-11">
              {shades.map((shade) => (
                <div key={shade} className="space-y-1 text-center">
                  <div
                    title={`--ds-${scale}-${shade}`}
                    className="h-8 rounded-sm border border-border"
                    style={{ background: `var(--ds-${scale}-${shade})` }}
                  />
                  <span className="block text-[10px] text-muted-foreground">{shade}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Demo>
    </Section>
  );
}

const typeScale = [
  { cls: "text-xs", name: "text-xs", px: 12 },
  { cls: "text-sm", name: "text-sm", px: 14 },
  { cls: "text-base", name: "text-base", px: 16 },
  { cls: "text-lg", name: "text-lg", px: 18 },
  { cls: "text-xl", name: "text-xl", px: 20 },
  { cls: "text-2xl", name: "text-2xl", px: 24 },
  { cls: "text-3xl", name: "text-3xl", px: 30 },
  { cls: "text-4xl", name: "text-4xl", px: 36 },
];
const weights = [
  { cls: "font-normal", name: "normal", value: 400 },
  { cls: "font-medium", name: "medium", value: 500 },
  { cls: "font-semibold", name: "semibold", value: 600 },
  { cls: "font-bold", name: "bold", value: 700 },
];

export function TypographySection() {
  return (
    <Section
      id="tipografi"
      title="Tipografi"
      description="Skala ukuran dan weight memakai default Tailwind. Font Inter dimuat oleh aplikasi, fallback system-ui."
    >
      <Demo label="Font" className="gap-4 sm:grid-cols-2 grid">
        <div className="space-y-1">
          <p className="text-2xl font-sans">Aa Bb Cc 0123</p>
          <code className="text-xs text-muted-foreground">--ds-font-sans · Inter, ui-sans-serif, system-ui</code>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-mono">Aa Bb Cc 0123</p>
          <code className="text-xs text-muted-foreground">--ds-font-mono · ui-monospace, SFMono-Regular, Menlo</code>
        </div>
      </Demo>
      <Demo label="Ukuran" className="block divide-y divide-border">
        {typeScale.map((t) => (
          <div key={t.name} className="gap-4 py-2 grid grid-cols-[6.5rem_1fr] items-baseline">
            <code className="text-xs text-muted-foreground">
              {t.name} · {t.px}px
            </code>
            <p className={`${t.cls} truncate`}>Pendaftaran siswa baru dibuka</p>
          </div>
        ))}
      </Demo>
      <Demo label="Weight" className="gap-4 sm:grid-cols-4 grid grid-cols-2">
        {weights.map((w) => (
          <div key={w.name}>
            <p className={`${w.cls} text-xl`}>Aisyah</p>
            <code className="text-xs text-muted-foreground">
              {w.name} · {w.value}
            </code>
          </div>
        ))}
      </Demo>
    </Section>
  );
}

const spacing = [1, 2, 3, 4, 6, 8, 12, 16];

export function SizingSection() {
  return (
    <Section
      id="sizing"
      title="Spacing dan sizing"
      description="Spacing berbasis 4px (skala Tailwind). Kontrol punya tiga ukuran dengan tinggi tetap supaya baris form dan toolbar sejajar."
    >
      <Demo label="Skala spacing" className="space-y-2 block">
        {spacing.map((n) => (
          <div key={n} className="gap-4 grid grid-cols-[6.5rem_1fr] items-center">
            <code className="text-xs text-muted-foreground">
              {n} · {n * 4}px
            </code>
            <div className="h-3 rounded-sm bg-primary" style={{ width: n * 4 }} />
          </div>
        ))}
      </Demo>
      <Demo label="Button · h-8 / h-10 / h-12">
        <Button size="sm">Kecil</Button>
        <Button size="md">Sedang</Button>
        <Button size="lg">Besar</Button>
      </Demo>
      <Demo label="Input · h-8 / h-10 / h-12" className="max-w-xs flex-col items-stretch">
        <Input size="sm" placeholder="Kecil" aria-label="Input kecil" />
        <Input size="md" placeholder="Sedang" aria-label="Input sedang" />
        <Input size="lg" placeholder="Besar" aria-label="Input besar" />
      </Demo>
      <Demo label="Spinner · 16 / 20 / 24px">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </Demo>
      <Demo label="Container · max-w">
        <p className="text-sm text-muted-foreground">
          sm 672px · md 896px · lg 1152px · full tanpa batas, padding horizontal 16px (24px mulai sm).
        </p>
      </Demo>
    </Section>
  );
}

const radii = [
  { name: "sm", cls: "rounded-sm" },
  { name: "md", cls: "rounded-md" },
  { name: "lg", cls: "rounded-lg" },
  { name: "xl", cls: "rounded-xl" },
  { name: "full", cls: "rounded-full" },
];
const radiusVarNames = radii.map((r) => `--ds-radius-${r.name}`);

export function RadiusSection() {
  const values = useRootVars(radiusVarNames);
  return (
    <Section
      id="radius"
      title="Radius"
      description="Skin Neo, Glass, Clay, Fluid, dan Aurora membesarkan md, lg, dan xl; Swiss menjadikannya 0."
    >
      <Demo label="Token" className="gap-6">
        {radii.map((r) => (
          <div key={r.name} className="space-y-2">
            <div className={`size-16 border-2 border-primary bg-muted ${r.cls}`} />
            <div className="text-xs">
              <code className="font-medium block">{r.name}</code>
              <span className="text-muted-foreground">{r.name === "full" ? "9999px" : values[`--ds-radius-${r.name}`]}</span>
            </div>
          </div>
        ))}
      </Demo>
    </Section>
  );
}

const shadows = [
  { name: "sm", cls: "shadow-sm" },
  { name: "md", cls: "shadow-md" },
  { name: "lg", cls: "shadow-lg" },
  { name: "raised", cls: "shadow-raised" },
  { name: "inset", cls: "shadow-inset" },
];

export function ShadowSection() {
  return (
    <Section
      id="shadow"
      title="Shadow dan motion"
      description="raised dan inset bernilai none di skin Flat; keduanya baru terlihat di skin Neo dan Clay."
    >
      <Demo label="Shadow" className="gap-6 sm:grid-cols-5 grid grid-cols-2">
        {shadows.map((s) => (
          <div key={s.name} className="space-y-2">
            <div className={`h-20 rounded-lg border border-border bg-surface ${s.cls}`} />
            <code className="text-xs font-medium block">{s.name}</code>
          </div>
        ))}
      </Demo>
      <Demo label="Motion" className="block">
        <dl className="gap-y-1 text-sm grid grid-cols-[6.5rem_1fr]">
          <dt className="text-muted-foreground">fast</dt>
          <dd className="font-mono">150ms</dd>
          <dt className="text-muted-foreground">normal</dt>
          <dd className="font-mono">200ms</dd>
          <dt className="text-muted-foreground">easing</dt>
          <dd className="font-mono">cubic-bezier(0.4, 0, 0.2, 1)</dd>
        </dl>
      </Demo>
    </Section>
  );
}
