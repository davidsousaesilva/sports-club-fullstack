import { Navigate, Outlet } from "react-router";

import { appPaths } from "../../../../app/router/paths";
import { useAuth } from "../../hooks/use-auth";

type ProtectedRouteProps = {
  allowedRoles?: string[];
  requireActiveView?: boolean;
};

function ProtectedRoute({
  allowedRoles,
  requireActiveView = false,
}: ProtectedRouteProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to={appPaths.login} replace />;
  }

  if (requireActiveView && !auth.activeView) {
    return <Navigate to={appPaths.login} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some((role) =>
      auth.availableViews.includes(role as never),
    );

    if (!hasAccess) {
      return <Navigate to={appPaths.home} replace />;
    }
  }

  return <Outlet />;
}

export { ProtectedRoute };
