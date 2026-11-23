import type { ComponentType } from "react";
import { AccordionDemo } from "./AccordionDemo";
import { AlertDemo } from "./AlertDemo";
import { AvatarDemo } from "./AvatarDemo";
import { BadgeDemo } from "./BadgeDemo";
import { BreadcrumbDemo } from "./BreadcrumbDemo";
import { ButtonDemo } from "./ButtonDemo";
import { CardDemo } from "./CardDemo";
import { CheckboxDemo } from "./CheckboxDemo";
import { ComboboxDemo } from "./ComboboxDemo";
import { DataTableDemo } from "./DataTableDemo";
import { DialogDemo } from "./DialogDemo";
import { DropdownMenuDemo } from "./DropdownMenuDemo";
import { EmptyStateDemo } from "./EmptyStateDemo";
import { FormFieldDemo } from "./FormFieldDemo";
import { InputDemo } from "./InputDemo";
import { LabelDemo } from "./LabelDemo";
import { LayoutDemo } from "./LayoutDemo";
import { PaginationDemo } from "./PaginationDemo";
import { PopoverDemo } from "./PopoverDemo";
import { RadioDemo } from "./RadioDemo";
import { SelectDemo } from "./SelectDemo";
import { SheetDemo } from "./SheetDemo";
import { SkeletonDemo } from "./SkeletonDemo";
import { SpinnerDemo } from "./SpinnerDemo";
import { SwitchDemo } from "./SwitchDemo";
import { TableDemo } from "./TableDemo";
import { TabsDemo } from "./TabsDemo";
import { TextareaDemo } from "./TextareaDemo";
import { ToastDemo } from "./ToastDemo";
import { TooltipDemo } from "./TooltipDemo";

export type DemoGroup = "Inti" | "Overlay dan navigasi" | "Data dan layout";
export type Demo = { slug: string; title: string; group: DemoGroup; summary: string; Demo: ComponentType };

export const demoGroups: DemoGroup[] = ["Inti", "Overlay dan navigasi", "Data dan layout"];

// urutan di sini menentukan urutan daftar dan tautan sebelumnya/berikutnya
export const demos: Demo[] = [
  {
    slug: "button",
    title: "Button",
    group: "Inti",
    summary: "Tombol aksi dengan lima variant, tiga ukuran, state loading dan disabled.",
    Demo: ButtonDemo,
  },
  {
    slug: "input",
    title: "Input",
    group: "Inti",
    summary: "Kolom teks satu baris dengan ukuran, state invalid dan disabled.",
    Demo: InputDemo,
  },
  {
    slug: "textarea",
    title: "Textarea",
    group: "Inti",
    summary: "Kolom teks banyak baris untuk catatan dan keterangan.",
    Demo: TextareaDemo,
  },
  {
    slug: "label",
    title: "Label",
    group: "Inti",
    summary: "Label form dengan penanda wajib yang terhubung ke kontrolnya.",
    Demo: LabelDemo,
  },
  {
    slug: "form-field",
    title: "FormField",
    group: "Inti",
    summary: "Label, kontrol, hint, dan error dalam satu kolom form yang sudah terhubung.",
    Demo: FormFieldDemo,
  },
  { slug: "badge", title: "Badge", group: "Inti", summary: "Label status kecil untuk nilai yang berarti, bukan hiasan.", Demo: BadgeDemo },
  {
    slug: "alert",
    title: "Alert",
    group: "Inti",
    summary: "Pesan inline yang menetap, empat variant, opsional role alert.",
    Demo: AlertDemo,
  },
  { slug: "avatar", title: "Avatar", group: "Inti", summary: "Foto profil bulat dengan fallback inisial.", Demo: AvatarDemo },
  { slug: "checkbox", title: "Checkbox", group: "Inti", summary: "Pilihan ganda dengan state invalid dan disabled.", Demo: CheckboxDemo },
  { slug: "radio", title: "Radio", group: "Inti", summary: "Pilihan tunggal dalam satu grup.", Demo: RadioDemo },
  {
    slug: "switch",
    title: "Switch",
    group: "Inti",
    summary: "Saklar aktif/nonaktif untuk setelan yang berlaku seketika.",
    Demo: SwitchDemo,
  },
  { slug: "spinner", title: "Spinner", group: "Inti", summary: "Indikator memuat dengan label untuk pembaca layar.", Demo: SpinnerDemo },
  { slug: "skeleton", title: "Skeleton", group: "Inti", summary: "Placeholder bentuk konten saat data belum ada.", Demo: SkeletonDemo },
  {
    slug: "card",
    title: "Card",
    group: "Inti",
    summary: "Wadah untuk satu kelompok konten dengan header, isi, dan footer.",
    Demo: CardDemo,
  },
  {
    slug: "dialog",
    title: "Dialog",
    group: "Overlay dan navigasi",
    summary: "Jendela modal untuk konfirmasi dan form singkat.",
    Demo: DialogDemo,
  },
  {
    slug: "sheet",
    title: "Sheet",
    group: "Overlay dan navigasi",
    summary: "Panel samping atau bawah untuk form buat dan ubah.",
    Demo: SheetDemo,
  },
  {
    slug: "select",
    title: "Select",
    group: "Overlay dan navigasi",
    summary: "Pilihan dari daftar tetap, dengan grup dan state invalid.",
    Demo: SelectDemo,
  },
  {
    slug: "combobox",
    title: "Combobox",
    group: "Overlay dan navigasi",
    summary: "Pilihan dari daftar panjang dengan pencarian.",
    Demo: ComboboxDemo,
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    group: "Overlay dan navigasi",
    summary: "Menu aksi untuk satu baris atau satu objek.",
    Demo: DropdownMenuDemo,
  },
  {
    slug: "tabs",
    title: "Tabs",
    group: "Overlay dan navigasi",
    summary: "Berpindah antar panel konten dalam satu halaman.",
    Demo: TabsDemo,
  },
  {
    slug: "accordion",
    title: "Accordion",
    group: "Overlay dan navigasi",
    summary: "Bagian yang bisa dibuka dan ditutup, tunggal atau ganda.",
    Demo: AccordionDemo,
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    group: "Overlay dan navigasi",
    summary: "Keterangan singkat saat kontrol difokus atau disorot.",
    Demo: TooltipDemo,
  },
  {
    slug: "popover",
    title: "Popover",
    group: "Overlay dan navigasi",
    summary: "Panel kecil berisi kontrol, dibuka dari sebuah tombol.",
    Demo: PopoverDemo,
  },
  {
    slug: "toast",
    title: "Toast",
    group: "Overlay dan navigasi",
    summary: "Notifikasi sementara dengan variant default, sukses, dan gagal.",
    Demo: ToastDemo,
  },
  {
    slug: "pagination",
    title: "Pagination",
    group: "Data dan layout",
    summary: "Navigasi halaman dengan elipsis untuk daftar panjang.",
    Demo: PaginationDemo,
  },
  { slug: "table", title: "Table", group: "Data dan layout", summary: "Tabel data dengan state memuat dan kosong.", Demo: TableDemo },
  {
    slug: "data-table",
    title: "DataTable",
    group: "Data dan layout",
    summary: "Tabel dengan sorting, seleksi baris, memuat, kosong, dan halaman.",
    Demo: DataTableDemo,
  },
  {
    slug: "empty-state",
    title: "EmptyState",
    group: "Data dan layout",
    summary: "Keadaan kosong dengan judul, penjelasan, dan satu aksi.",
    Demo: EmptyStateDemo,
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    group: "Data dan layout",
    summary: "Jejak lokasi halaman, dengan Link router lewat asChild.",
    Demo: BreadcrumbDemo,
  },
  {
    slug: "layout",
    title: "Layout",
    group: "Data dan layout",
    summary: "Container, Stack, dan PageHeader untuk menyusun halaman.",
    Demo: LayoutDemo,
  },
];
