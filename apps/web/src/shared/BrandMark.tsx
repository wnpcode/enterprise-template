import { Link } from "react-router";
import { cn } from "@wnpcode/design-system";
import { env } from "../app/env";
import { LogoMark } from "./LogoMark";

type Props = { collapsed?: boolean; to?: string; className?: string };

// satu-satunya sumber nama produk yang tampil di header, sidebar, dan halaman auth
export function BrandMark({ collapsed = false, to, className }: Props) {
  const content = (
    <>
      <LogoMark />
      <span className={cn(collapsed && "sr-only")}>{env.VITE_APP_NAME}</span>
    </>
  );
  const cls = cn("inline-flex min-h-11 items-center gap-2 font-semibold tracking-tight", className);
  if (to) {
    return (
      <Link to={to} className={cn(cls, "rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring")}>
        {content}
      </Link>
    );
  }
  return <span className={cls}>{content}</span>;
}
