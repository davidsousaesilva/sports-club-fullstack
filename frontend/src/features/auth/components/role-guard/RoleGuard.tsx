import type { ReactNode } from "react";

import { useAuth } from "../../hooks/use-auth";

type RoleGuardProps = {
  allowedRoles: string[];
  fallback?: ReactNode;
  children: ReactNode;
};

function RoleGuard({
  allowedRoles,
  fallback = null,
  children,
}: RoleGuardProps) {
  const auth = useAuth();

  const hasAccess = allowedRoles.some((role) => auth.activeView === role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export { RoleGuard };
