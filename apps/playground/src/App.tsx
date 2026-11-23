import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { ConfigBar, type PlaygroundSkin } from "./ConfigBar";
import { ShellContext, type ShellConfig } from "./shell/config";
import { icons } from "./shell/icons";
import { ShellPanel } from "./shell/Panel";
import { NavLinkItem, Shell } from "./shell/Shell";
import { ColorSection, RadiusSection, ShadowSection, SizingSection, TypographySection } from "./sections/foundations";
import { BadgeSection, ButtonSection } from "./sections/components/actions";
import {
  CheckboxSection,
  ComboboxSection,
  FormFieldSection,
  InputSection,
  RadioSection,
  SelectSection,
  SwitchSection,
  TextareaSection,
} from "./sections/components/forms";
import {
  DialogSection,
  DropdownMenuSection,
  PopoverSection,
  SheetSection,
  ToastSection,
  TooltipSection,
} from "./sections/components/overlays";
import { AccordionSection, BreadcrumbSection, PaginationSection, TabsSection } from "./sections/components/navigation";
import { AvatarSection, CardSection, DataTableSection, LayoutSection, TableSection } from "./sections/components/data";
import { AlertSection, EmptyStateSection, SkeletonSection, SpinnerSection } from "./sections/components/feedback";
import { AppShellSection } from "./sections/components/shell";

export type { PlaygroundSkin };

type Entry = { id: string; label: string; Component: ComponentType };
type Group = { label: string; icon: ReactNode; entries: Entry[] };

const groups: Group[] = [
  {
    label: "Fondasi",
    icon: icons.palette,
    entries: [
      { id: "warna", label: "Warna", Component: ColorSection },
      { id: "tipografi", label: "Tipografi", Component: TypographySection },
      { id: "sizing", label: "Spacing dan sizing", Component: SizingSection },
      { id: "radius", label: "Radius", Component: RadiusSection },
      { id: "shadow", label: "Shadow dan motion", Component: ShadowSection },
    ],
  },
  {
    label: "Aksi",
    icon: icons.pointer,
    entries: [
      { id: "button", label: "Button", Component: ButtonSection },
      { id: "badge", label: "Badge", Component: BadgeSection },
    ],
  },
  {
    label: "Form",
    icon: icons.form,
    entries: [
      { id: "input", label: "Input", Component: InputSection },
      { id: "textarea", label: "Textarea", Component: TextareaSection },
      { id: "form-field", label: "Label dan FormField", Component: FormFieldSection },
      { id: "checkbox", label: "Checkbox", Component: CheckboxSection },
      { id: "radio", label: "Radio", Component: RadioSection },
      { id: "switch", label: "Switch", Component: SwitchSection },
      { id: "select", label: "Select", Component: SelectSection },
      { id: "combobox", label: "Combobox", Component: ComboboxSection },
    ],
  },
  {
    label: "Overlay",
    icon: icons.overlay,
    entries: [
      { id: "dialog", label: "Dialog", Component: DialogSection },
      { id: "sheet", label: "Sheet", Component: SheetSection },
      { id: "dropdown-menu", label: "Dropdown menu", Component: DropdownMenuSection },
      { id: "popover", label: "Popover", Component: PopoverSection },
      { id: "tooltip", label: "Tooltip", Component: TooltipSection },
      { id: "toast", label: "Toast", Component: ToastSection },
    ],
  },
  {
    label: "Navigasi",
    icon: icons.compass,
    entries: [
      { id: "tabs", label: "Tabs", Component: TabsSection },
      { id: "accordion", label: "Accordion", Component: AccordionSection },
      { id: "breadcrumb", label: "Breadcrumb", Component: BreadcrumbSection },
      { id: "pagination", label: "Pagination", Component: PaginationSection },
    ],
  },
  {
    label: "Data dan layout",
    icon: icons.table,
    entries: [
      { id: "table", label: "Table", Component: TableSection },
      { id: "data-table", label: "DataTable", Component: DataTableSection },
      { id: "card", label: "Card", Component: CardSection },
      { id: "avatar", label: "Avatar", Component: AvatarSection },
      { id: "layout", label: "Layout", Component: LayoutSection },
    ],
  },
  {
    label: "Umpan balik",
    icon: icons.bell,
    entries: [
      { id: "alert", label: "Alert", Component: AlertSection },
      { id: "empty-state", label: "Empty state", Component: EmptyStateSection },
      { id: "skeleton", label: "Skeleton", Component: SkeletonSection },
      { id: "spinner", label: "Spinner", Component: SpinnerSection },
    ],
  },
  {
    label: "Pola",
    icon: icons.layout,
    entries: [{ id: "app-shell", label: "App shell", Component: AppShellSection }],
  },
];

function useHashId() {
  const read = () => window.location.hash.slice(1);
  const [id, setId] = useState(read);
  useEffect(() => {
    const onChange = () => setId(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return id;
}

type AppProps = {
  brand: boolean;
  onBrandChange: (next: boolean) => void;
  skin: PlaygroundSkin;
  onSkinChange: (next: PlaygroundSkin) => void;
  shell: ShellConfig;
  onShellChange: (next: ShellConfig) => void;
};

export function App({ brand, onBrandChange, skin, onSkinChange, shell, onShellChange }: AppProps) {
  const activeId = useHashId();
  const [panelOpen, setPanelOpen] = useState(false);
  const context = useMemo(() => ({ config: shell, setConfig: onShellChange, openPanel: () => setPanelOpen(true) }), [shell, onShellChange]);
  const tooltipSide = shell.sidebar.side === "left" ? "right" : "left";

  return (
    <ShellContext.Provider value={context}>
      <Shell
        config={shell}
        onCollapsedChange={(collapsed) => onShellChange({ ...shell, sidebar: { ...shell.sidebar, collapsed } })}
        title="Design System Playground"
        navLabel="Daftar section"
        headerContent={<ConfigBar onOpenPanel={() => setPanelOpen(true)} />}
        nav={(collapsed) =>
          collapsed ? (
            <ul className="space-y-1">
              {groups.map((group) => (
                <li key={group.label}>
                  <NavLinkItem
                    icon={group.icon}
                    label={group.label}
                    href={`#${group.entries[0].id}`}
                    collapsed
                    tooltipSide={tooltipSide}
                    active={group.entries.some((e) => e.id === activeId)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-5">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-1 px-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">{group.label}</p>
                  <ul>
                    {group.entries.map((e) => (
                      <li key={e.id}>
                        <NavLinkItem
                          icon={null}
                          label={e.label}
                          href={`#${e.id}`}
                          collapsed={false}
                          tooltipSide={tooltipSide}
                          active={activeId === e.id}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        }
      >
        <div className="max-w-4xl px-4 py-8 sm:px-6 mx-auto w-full">
          {groups
            .flatMap((g) => g.entries)
            .map(({ id, Component }) => (
              <Component key={id} />
            ))}
        </div>
      </Shell>
      <ShellPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        brand={brand}
        onBrandChange={onBrandChange}
        skin={skin}
        onSkinChange={onSkinChange}
        config={shell}
        onConfigChange={onShellChange}
      />
    </ShellContext.Provider>
  );
}
