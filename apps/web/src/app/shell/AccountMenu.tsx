import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@enterprise/design-system";
import { version } from "../../../package.json";
import { useAuth } from "../../features/auth";

type Props = { compact?: boolean; side?: "top" | "right" | "bottom" | "left" };

export function AccountMenu({ compact = false, side }: Props) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="min-h-11" aria-label={compact ? user?.name : undefined}>
          <Avatar name={user?.name ?? ""} size="sm" alt="" className="size-7 text-xs" />
          {!compact && (
            <>
              <span className="max-w-40 truncate">{user?.name}</span>
              <ChevronDown aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side={side}>
        <DropdownMenuLabel>
          {user?.name}
          <span className="font-normal block">{user?.email}</span>
          <span className="font-normal block">{t("app.version", { version })}</span>
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate("/app/profil")}>{t("account.profile")}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/app/pengaturan")}>{t("account.settings")}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          {t("account.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
