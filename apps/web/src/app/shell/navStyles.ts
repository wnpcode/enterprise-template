// gaya baris menu bersama NavLeaf, NavGroup, dan NavTree
export const rowClass =
  "min-h-11 gap-3 px-3 text-sm flex items-center overflow-hidden rounded-md transition-colors hover:bg-muted active:bg-muted";
export const activeClass = "font-medium bg-primary/10 text-primary hover:bg-primary/10";

/** Indentasi per tingkat di pohon lipat: tingkat 1 sejajar teks induk (2.75rem), tiap tingkat berikutnya +1rem. */
export const indent = (depth: number) => (depth > 0 ? { paddingLeft: `${2.75 + (depth - 1)}rem` } : undefined);
