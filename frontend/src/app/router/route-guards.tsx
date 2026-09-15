import { Navigate, Outlet } from "react-router";

import { useAuth } from "../../features/auth";
import type { Role } from "../../lib/constants/roles";
import { appPaths } from "./paths";

type RoleRouteGuardProps = {
  allowedRoles?: Role[];
};

function AuthGuard() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to={appPaths.login} replace />;
  }

  return <Outlet />;
}

function RoleRouteGuard({ allowedRoles }: RoleRouteGuardProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to={appPaths.login} replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  if (!auth.activeView || !allowedRoles.includes(auth.activeView)) {
    return <Navigate to={appPaths.unauthorized} replace />;
  }

  return <Outlet />;
}

export { AuthGuard, RoleRouteGuard };
