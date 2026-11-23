import type { ReactNode } from "react";
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger, useTheme, type Theme } from "@enterprise/design-system";
import { icons } from "./shell/icons";

export type PlaygroundSkin = "flat" | "neo" | "glass" | "clay" | "fluid" | "aurora" | "swiss";

function SvgIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      {children}
    </svg>
  );
}

const SunIcon = (
  <SvgIcon>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </SvgIcon>
);
const MoonIcon = (
  <SvgIcon>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </SvgIcon>
);
const MonitorIcon = (
  <SvgIcon>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </SvgIcon>
);

export type Option<T extends string> = { value: T; label: string; content: ReactNode; iconOnly?: boolean };

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (next: T) => void;
  disabled?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className={cn("p-0.5 inline-flex flex-wrap rounded-md bg-muted", disabled && "opacity-50")}>
      {options.map((o) => {
        const button = (
          <button
            type="button"
            disabled={disabled}
            aria-pressed={value === o.value}
            aria-label={o.iconOnly ? o.label : undefined}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-7 min-w-8 gap-1.5 px-2 text-sm font-medium inline-flex items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed",
              value === o.value && "bg-surface text-foreground shadow-sm",
            )}
          >
            {o.content}
          </button>
        );
        if (!o.iconOnly) return <span key={o.value}>{button}</span>;
        return (
          <Tooltip key={o.value}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{o.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

const themeOptions: Option<Theme>[] = [
  { value: "light", label: "Terang", content: SunIcon, iconOnly: true },
  { value: "dark", label: "Gelap", content: MoonIcon, iconOnly: true },
  { value: "system", label: "Ikuti sistem", content: MonitorIcon, iconOnly: true },
];

export function ConfigBar({ onOpenPanel }: { onOpenPanel: () => void }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div className="gap-x-3 gap-y-2 flex flex-wrap items-center">
      <div className="gap-2 flex items-center">
        <Segmented label="Tema" value={theme} options={themeOptions} onChange={setTheme} />
        {theme === "system" && <span className="text-xs text-muted-foreground">({resolvedTheme})</span>}
      </div>
      <Button variant="outline" size="sm" onClick={onOpenPanel}>
        {icons.sliders}
        Kustomisasi
      </Button>
    </div>
  );
}
