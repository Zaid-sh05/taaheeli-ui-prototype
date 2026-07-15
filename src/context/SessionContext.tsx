import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RoleKey } from "@/config/roles";

const SELECTED_ROLE_KEY = "taaheeli-selected-role";
const SESSION_KEY = "taaheeli-session";

export interface SessionInfo {
  role: RoleKey;
  username: string;
  isAuthenticated: true;
}

interface SessionContextValue {
  selectedRole: RoleKey | null;
  setSelectedRole: (role: RoleKey) => void;
  clearSelectedRole: () => void;
  session: SessionInfo | null;
  login: (role: RoleKey, username: string) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRoleState] = useState<RoleKey | null>(() => {
    try {
      const v = sessionStorage.getItem(SELECTED_ROLE_KEY);
      return (v as RoleKey | null) ?? null;
    } catch {
      return null;
    }
  });

  const [session, setSession] = useState<SessionInfo | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as SessionInfo;
    } catch {
      // ignore
    }
    return null;
  });

  const setSelectedRole = (role: RoleKey) => {
    setSelectedRoleState(role);
    try {
      sessionStorage.setItem(SELECTED_ROLE_KEY, role);
    } catch {
      // ignore
    }
  };

  const clearSelectedRole = () => {
    setSelectedRoleState(null);
    try {
      sessionStorage.removeItem(SELECTED_ROLE_KEY);
    } catch {
      // ignore
    }
  };

  const login = (role: RoleKey, username: string) => {
    const s: SessionInfo = { role, username, isAuthenticated: true };
    setSession(s);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setSession(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  };

  // keep selectedRole in sync if session clears
  useEffect(() => {
    if (!session) {
      // keep selected role so user can return to login
    }
  }, [session]);

  const value = useMemo<SessionContextValue>(
    () => ({
      selectedRole,
      setSelectedRole,
      clearSelectedRole,
      session,
      login,
      logout,
    }),
    [selectedRole, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

export const ROLE_HOME: Record<RoleKey, string> = {
  manager: "/manager",
  doctor: "/therapist",
  admin: "/admin",
  parent: "/family",
  patient: "/patient",
};
