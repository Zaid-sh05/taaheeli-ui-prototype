import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession, ROLE_HOME } from "@/context/SessionContext";
import type { RoleKey } from "@/config/roles";

interface RoleRouteGuardProps {
  allowedRole: RoleKey;
  children: ReactNode;
}

export function RoleRouteGuard({ allowedRole, children }: RoleRouteGuardProps) {
  const { session } = useSession();
  const location = useLocation();

  if (!session || !session.isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (session.role !== allowedRole) {
    return <Navigate to={ROLE_HOME[session.role]} replace />;
  }

  return <>{children}</>;
}
