import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/cn";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PLACEHOLDER_NAV: Record<string, { label: string; icon: string }[]> = {
  manager: [
    { label: "نظرة عامة", icon: "LayoutDashboard" },
    { label: "الموظفون", icon: "Users" },
    { label: "التقارير", icon: "BarChart3" },
  ],
  doctor: [
    { label: "مرضاي", icon: "Users" },
    { label: "الخطط العلاجية", icon: "ClipboardList" },
    { label: "المواعيد", icon: "CalendarDays" },
  ],
  admin: [
    { label: "التسجيلات", icon: "UserPlus" },
    { label: "المواعيد", icon: "CalendarDays" },
    { label: "التنبيهات", icon: "Bell" },
  ],
  parent: [
    { label: "تقدم المريض", icon: "TrendingUp" },
    { label: "المواعيد", icon: "CalendarDays" },
    { label: "التواصل", icon: "MessageSquare" },
  ],
  patient: [
    { label: "برنامجي", icon: "HeartPulse" },
    { label: "مواعيدي", icon: "CalendarDays" },
    { label: "تماريني", icon: "Dumbbell" },
  ],
};

export function AppNav() {
  const { role } = useRole();
  if (!role) return null;
  const items = PLACEHOLDER_NAV[role] ?? [];

  return (
    <nav aria-label="القائمة الرئيسية" className="border-b border-neutral-100 bg-white">
      <ul className="mx-auto max-w-5xl px-4 sm:px-6 flex gap-1 overflow-x-auto py-2">
        {items.map((item, i) => {
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[item.icon] ?? Icons.Circle;
          return (
            <li key={i}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors min-h-[48px]",
                  i === 0 && "bg-primary-50 text-primary-700",
                )}
                aria-current={i === 0 ? "page" : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
