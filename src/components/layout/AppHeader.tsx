import { Link } from "react-router-dom";
import { useRole } from "@/context/RoleContext";
import { ROLES } from "@/config/roles";
import { TextSizeModeControl } from "@/components/ui/TextSizeModeControl";
import { LogOut, CircleUser as UserCircle2 } from "lucide-react";

export function AppHeader() {
  const { role, clearRole } = useRole();
  const roleMeta = role ? ROLES[role] : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="text-xl font-bold text-primary-700">تأهيلي</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <TextSizeModeControl />
          {roleMeta && (
            <div className="hidden sm:flex items-center gap-2 text-base text-neutral-700">
              <UserCircle2 className="h-5 w-5" aria-hidden="true" />
              <span className="font-semibold">{roleMeta.label}</span>
            </div>
          )}
          {role && (
            <button
              type="button"
              onClick={clearRole}
              className="inline-flex items-center gap-1.5 text-base font-semibold text-neutral-600 hover:text-error-700 min-h-[48px] px-2"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
