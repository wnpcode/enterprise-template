import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import {
  Label,
  PageHeader,
  Radio,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  useTheme,
  type Theme,
} from "@wnp_code/design-system";
import { LANGUAGE_NAMES, LANGUAGES, type Language } from "../../app/i18n";
import type { LayoutContext } from "../../app/layouts/DashboardLayout";
import { CHROME_STYLES, TONES } from "../../app/shell/chrome";
import { LAYOUT_PRESETS, matchPreset, type PresetId } from "../../app/shell/presets";
import type { LayoutPrefs } from "../../app/shell/useLayoutPrefs";
import { useSkin, type Skin } from "../../app/skin";
import { version } from "../../../package.json";

const ORIENTASI: LayoutPrefs["orientation"][] = ["vertical", "horizontal"];
const HEADER_TYPES: LayoutPrefs["headerType"][] = ["sticky", "static", "floating"];
const HEADER_SPANS: LayoutPrefs["headerSpan"][] = ["full", "inset"];
const SIDEBAR_TYPES: LayoutPrefs["sidebarType"][] = ["full", "floating"];
const SIDEBAR_SIDES: LayoutPrefs["sidebarSide"][] = ["left", "right"];

type PrefSelectProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
  disabled?: boolean;
};

function PrefSelect<T extends string>({ id, label, value, options, onChange, disabled }: PrefSelectProps<T>) {
  return (
    <div className="max-w-xs space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as T)} disabled={disabled}>
        <SelectTrigger id={id} className="min-h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function PengaturanPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { prefs, update } = useOutletContext<LayoutContext>();
  const { skin, setSkin } = useSkin();

  return (
    <div className="space-y-8">
      <PageHeader title={t("settings.title")} description={t("settings.description")} />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t("settings.appearance")}</h2>
        <div className="max-w-xs space-y-1.5">
          <Label htmlFor="tema">{t("settings.theme")}</Label>
          <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
            <SelectTrigger id="tema" className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("settings.themeLight")}</SelectItem>
              <SelectItem value="dark">{t("settings.themeDark")}</SelectItem>
              <SelectItem value="system">{t("settings.themeSystem")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-w-xs space-y-1.5">
          <Label htmlFor="gaya">{t("settings.skin")}</Label>
          <Select value={skin} onValueChange={(v) => setSkin(v as Skin)}>
            <SelectTrigger id="gaya" className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">{t("settings.skinFlat")}</SelectItem>
              <SelectItem value="neo">{t("settings.skinNeo")}</SelectItem>
              <SelectItem value="glass">{t("settings.skinGlass")}</SelectItem>
              <SelectItem value="clay">{t("settings.skinClay")}</SelectItem>
              <SelectItem value="fluid">{t("settings.skinFluid")}</SelectItem>
              <SelectItem value="aurora">{t("settings.skinAurora")}</SelectItem>
              <SelectItem value="swiss">{t("settings.skinSwiss")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-w-xs space-y-1.5">
          <Label htmlFor="bahasa">{t("settings.language")}</Label>
          <Select value={i18n.resolvedLanguage ?? i18n.language} onValueChange={(v) => i18n.changeLanguage(v as Language)}>
            <SelectTrigger id="bahasa" className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {LANGUAGE_NAMES[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("settings.navigation")}</h2>
        <PrefSelect<PresetId | "custom">
          id="layout-preset"
          label={t("settings.preset")}
          value={matchPreset(prefs)}
          options={[
            ...LAYOUT_PRESETS.map(({ id }) => ({ value: id, label: t(`settings.preset${id[0].toUpperCase()}${id.slice(1)}`) })),
            ...(matchPreset(prefs) === "custom" ? [{ value: "custom" as const, label: t("settings.presetCustom") }] : []),
          ]}
          onChange={(id) => {
            const chosen = LAYOUT_PRESETS.find((p) => p.id === id);
            if (chosen) update(chosen.prefs);
          }}
        />
        <p className="text-sm text-muted-foreground">{t("settings.presetNote")}</p>
        <fieldset className="space-y-1">
          <legend className="mb-1 text-sm font-medium">{t("settings.orientation")}</legend>
          {ORIENTASI.map((value) => (
            <div key={value} className="min-h-11 gap-2 flex items-center">
              <Radio
                id={`orientasi-${value}`}
                name="orientasi"
                value={value}
                checked={prefs.orientation === value}
                onChange={() => update({ orientation: value })}
              />
              <Label htmlFor={`orientasi-${value}`}>{t(`settings.${value}`)}</Label>
            </div>
          ))}
        </fieldset>
        <div className="min-h-11 gap-2 flex items-center">
          <Switch id="ciutkan" checked={prefs.collapsed} onCheckedChange={(collapsed) => update({ collapsed })} />
          <Label htmlFor="ciutkan">{t("settings.collapse")}</Label>
        </div>
        <p className="text-sm text-muted-foreground">{t("settings.mobileNote")}</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t("settings.header")}</h2>
        <div className="min-h-11 gap-2 flex items-center">
          <Switch
            id="header-visible"
            checked={prefs.headerVisible || prefs.orientation === "horizontal"}
            disabled={prefs.orientation === "horizontal"}
            onCheckedChange={(headerVisible) => update({ headerVisible })}
            aria-describedby={prefs.orientation === "horizontal" ? "header-visible-note" : undefined}
          />
          <Label htmlFor="header-visible">{t("settings.headerVisible")}</Label>
        </div>
        {prefs.orientation === "horizontal" && (
          <p id="header-visible-note" className="text-sm text-muted-foreground">
            {t("settings.headerVisibleNote")}
          </p>
        )}
        <PrefSelect
          id="header-type"
          label={t("settings.type")}
          value={prefs.headerType}
          options={HEADER_TYPES.map((value) => ({ value, label: t(`settings.type${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(headerType) => update({ headerType })}
        />
        <PrefSelect
          id="header-span"
          label={t("settings.headerSpan")}
          value={prefs.headerSpan}
          options={HEADER_SPANS.map((value) => ({ value, label: t(`settings.span${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(headerSpan) => update({ headerSpan })}
        />
        <PrefSelect
          id="header-style"
          label={t("settings.chromeStyle")}
          value={prefs.headerStyle}
          options={CHROME_STYLES.map((value) => ({ value, label: t(`settings.style${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(headerStyle) => update({ headerStyle })}
        />
        <PrefSelect
          id="header-tone"
          label={t("settings.tone")}
          value={prefs.headerTone}
          options={TONES.map((value) => ({ value, label: t(`settings.tone${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(headerTone) => update({ headerTone })}
          disabled={prefs.headerStyle !== "solid"}
        />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t("settings.sidebar")}</h2>
        <PrefSelect
          id="sidebar-type"
          label={t("settings.type")}
          value={prefs.sidebarType}
          options={SIDEBAR_TYPES.map((value) => ({ value, label: t(`settings.type${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(sidebarType) => update({ sidebarType })}
        />
        <PrefSelect
          id="sidebar-side"
          label={t("settings.sidebarSide")}
          value={prefs.sidebarSide}
          options={SIDEBAR_SIDES.map((value) => ({ value, label: t(`settings.side${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(sidebarSide) => update({ sidebarSide })}
        />
        <PrefSelect
          id="sidebar-style"
          label={t("settings.chromeStyle")}
          value={prefs.sidebarStyle}
          options={CHROME_STYLES.map((value) => ({ value, label: t(`settings.style${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(sidebarStyle) => update({ sidebarStyle })}
        />
        <PrefSelect
          id="sidebar-tone"
          label={t("settings.tone")}
          value={prefs.sidebarTone}
          options={TONES.map((value) => ({ value, label: t(`settings.tone${value[0].toUpperCase()}${value.slice(1)}`) }))}
          onChange={(sidebarTone) => update({ sidebarTone })}
          disabled={prefs.sidebarStyle !== "solid"}
        />
        <p className="text-sm text-muted-foreground">{t("settings.toneNote")}</p>
      </section>
      <section className="space-y-1">
        <h2 className="text-lg font-semibold">{t("settings.about")}</h2>
        <p className="text-sm text-muted-foreground">{t("app.version", { version })}</p>
      </section>
    </div>
  );
}
