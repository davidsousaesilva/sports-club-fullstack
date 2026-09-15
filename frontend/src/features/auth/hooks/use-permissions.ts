import { useMemo } from "react";

import {
  canAccessPage,
  getAccessibleNavigationItems,
} from "../../../lib/auth/permission-resolver";
import type { Role } from "../../../lib/constants/roles";
import { useAuth } from "./use-auth";

type UsePermissionsResult = {
  canAccess: (roles: Role[]) => boolean;
  availableRoles: Role[];
  activeRole: Role | null;
};

type NavigationLikeItem = {
  label: string;
  path: string;
  roles: Role[];
};

function usePermissions(): UsePermissionsResult {
  const auth = useAuth();

  const canAccess = useMemo(() => {
    return (requiredRoles: Role[]) =>
      canAccessPage(auth.availableViews, { roles: requiredRoles });
  }, [auth.availableViews]);

  return {
    canAccess,
    availableRoles: auth.availableViews,
    activeRole: auth.activeView,
  };
}

function useNavigationPermissions<T extends NavigationLikeItem>(
  items: T[],
): T[] {
  const auth = useAuth();

  return useMemo(() => {
    if (!auth.activeView) {
      return [];
    }

    return getAccessibleNavigationItems(auth.activeView, items) as T[];
  }, [auth.activeView, items]);
}

export { useNavigationPermissions, usePermissions };
