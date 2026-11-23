import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "Foundations" };
export default meta;

const semanticColors = [
  ["background", "foreground"],
  ["surface", "surface-foreground"],
  ["muted", "muted-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["success", "success-foreground"],
  ["warning", "warning-foreground"],
  ["danger", "danger-foreground"],
  ["info", "info-foreground"],
  ["success-subtle", "success-subtle-fg"],
  ["warning-subtle", "warning-subtle-fg"],
  ["danger-subtle", "danger-subtle-fg"],
  ["info-subtle", "info-subtle-fg"],
] as const;

export const Colors: StoryObj = {
  render: () => (
    <div className="gap-3 sm:grid-cols-2 lg:grid-cols-3 grid">
      {semanticColors.map(([bg, fg]) => (
        <div
          key={bg}
          className="p-4 text-sm rounded-md border border-border"
          style={{ background: `var(--ds-color-${bg})`, color: `var(--ds-color-${fg})` }}
        >
          <div className="font-medium">{bg}</div>
          <div className="opacity-80">{fg}</div>
        </div>
      ))}
    </div>
  ),
};

const typeScale = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl"];

export const Typography: StoryObj = {
  render: () => (
    <div className="space-y-3">
      {typeScale.map((cls) => (
        <p key={cls} className={cls}>
          <span className="text-xs mr-3 font-mono text-muted-foreground">{cls}</span>
          Sistem desain enterprise yang konsisten.
        </p>
      ))}
      <p className="font-medium">font-medium 500</p>
      <p className="font-semibold">font-semibold 600</p>
      <p className="font-bold">font-bold 700</p>
    </div>
  ),
};

export const Spacing: StoryObj = {
  render: () => (
    <div className="space-y-2">
      {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
        <div key={n} className="gap-3 text-sm flex items-center">
          <span className="w-10 font-mono text-muted-foreground">{n}</span>
          <div className="h-4 bg-primary" style={{ width: `calc(var(--spacing) * ${n})` }} />
          <span className="text-muted-foreground">{n * 4}px</span>
        </div>
      ))}
    </div>
  ),
};

export const Radius: StoryObj = {
  render: () => (
    <div className="gap-4 flex flex-wrap">
      {["rounded-none", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"].map((cls) => (
        <div key={cls} className="text-sm text-center">
          <div className={`size-16 bg-primary ${cls}`} />
          <div className="mt-2 text-xs font-mono text-muted-foreground">{cls}</div>
        </div>
      ))}
    </div>
  ),
};

export const Shadows: StoryObj = {
  render: () => (
    <div className="gap-6 p-4 flex flex-wrap">
      {["shadow-sm", "shadow-md", "shadow-lg"].map((cls) => (
        <div key={cls} className={`p-6 text-sm rounded-lg border border-border bg-surface ${cls}`}>
          {cls}
        </div>
      ))}
    </div>
  ),
};
