import type { ReactNode } from "react";

function Ico({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      {children}
    </svg>
  );
}

export const icons = {
  home: (
    <Ico>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </Ico>
  ),
  users: (
    <Ico>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      <path d="M18 14.5c2.2.7 3.5 2.7 3.5 5.5" />
    </Ico>
  ),
  settings: (
    <Ico>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </Ico>
  ),
  palette: (
    <Ico>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="10" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="15.5" cy="10" r="1" />
    </Ico>
  ),
  pointer: (
    <Ico>
      <path d="M5 3l6 16 2.5-6.5L20 10 5 3Z" />
    </Ico>
  ),
  form: (
    <Ico>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </Ico>
  ),
  overlay: (
    <Ico>
      <rect x="3" y="5" width="14" height="12" rx="2" />
      <path d="M7 21h14V9" />
    </Ico>
  ),
  compass: (
    <Ico>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </Ico>
  ),
  table: (
    <Ico>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 10v10" />
    </Ico>
  ),
  bell: (
    <Ico>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z" />
      <path d="M10 21h4" />
    </Ico>
  ),
  layout: (
    <Ico>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </Ico>
  ),
  sliders: (
    <Ico>
      <path d="M4 7h4M12 7h8M4 17h8M16 17h4" />
      <circle cx="10" cy="7" r="2" />
      <circle cx="14" cy="17" r="2" />
    </Ico>
  ),
};
