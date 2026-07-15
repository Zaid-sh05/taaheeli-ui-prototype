import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { RoleKey, Audience } from "@/config/roles";
import { ROLES } from "@/config/roles";

interface RoleContextValue {
  role: RoleKey | null;
  audience: Audience | null;
  setRole: (role: RoleKey | null) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleKey | null>(null);

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      audience: role ? ROLES[role].audience : null,
      setRole: (r) => setRoleState(r),
      clearRole: () => setRoleState(null),
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
