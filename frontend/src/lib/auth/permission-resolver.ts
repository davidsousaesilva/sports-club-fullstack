import type { Role } from "../constants/roles";

type PageAccessConfig = {
  roles: Role[];
};

type NavigationItem = {
  label: string;
  path: string;
  roles: Role[];
};

function hasRole(availableRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.some((role) => availableRoles.includes(role));
}

function canAccessPage(
  userRoles: Role[],
  pageAccess: PageAccessConfig,
): boolean {
  return hasRole(userRoles, pageAccess.roles);
}

function getAccessibleNavigationItems(
  userRole: Role,
  items: NavigationItem[],
): NavigationItem[] {
  return items.filter((item) => item.roles.includes(userRole));
}

function canAccessRoleView(
  userRoles: Role[],
  activeView: Role | null,
): boolean {
  return activeView ? userRoles.includes(activeView) : false;
}

export {
  canAccessPage,
  canAccessRoleView,
  getAccessibleNavigationItems,
  hasRole,
};
export type { NavigationItem, PageAccessConfig };
