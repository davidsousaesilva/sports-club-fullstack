import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Menu } from "lucide-react";

import { appPaths } from "../app/router/paths";
import { navigationSections } from "../shared/hooks/navigation";
import { useAuth, useNavigationPermissions, useLogout } from "../features/auth";
import { type Role } from "../lib/constants/roles";
import { AccountMenu, AppSidebar } from "../shared/shell";

function getInitials(name: string | undefined): string {
  if (!name) {
    return "US";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "US";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAuth();
  const logout = useLogout();
  const navigationItems = useNavigationPermissions(navigationSections);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const desktopAccountMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileAccountMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileSidebarRef = useRef<HTMLDivElement | null>(null);

  const userName = auth.claims?.name ?? "Authenticated User";
  const userEmail = auth.claims?.email ?? "";
  const userInitials = useMemo(() => getInitials(userName), [userName]);

  useEffect(() => {
    setIsAccountMenuOpen(false);
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleDocumentPointerDown(event: MouseEvent | TouchEvent): void {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const clickedOutsideDesktopAccount =
        desktopAccountMenuRef.current !== null &&
        !desktopAccountMenuRef.current.contains(target);

      const clickedOutsideMobileAccount =
        mobileAccountMenuRef.current !== null &&
        !mobileAccountMenuRef.current.contains(target);

      if (clickedOutsideDesktopAccount && clickedOutsideMobileAccount) {
        setIsAccountMenuOpen(false);
      }

      if (
        isMobileSidebarOpen &&
        mobileSidebarRef.current !== null &&
        !mobileSidebarRef.current.contains(target)
      ) {
        setIsMobileSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentPointerDown);
    document.addEventListener("touchstart", handleDocumentPointerDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentPointerDown);
      document.removeEventListener("touchstart", handleDocumentPointerDown);
    };
  }, [isMobileSidebarOpen]);

  const handleProfileNavigation = (): void => {
    setIsAccountMenuOpen(false);
    setIsMobileSidebarOpen(false);
    navigate(appPaths.profile);
  };

  const handleLogout = (): void => {
    setIsAccountMenuOpen(false);
    setIsMobileSidebarOpen(false);
    logout();
  };

  const handleViewChange = (role: Role): void => {
    auth.setActiveView(role);
    setIsAccountMenuOpen(false);
    setIsMobileSidebarOpen(false);
  };

  const handleAccountMenuToggle = (): void => {
    setIsAccountMenuOpen((previous) => !previous);
  };

  const handleMobileSidebarOpen = (): void => {
    setIsMobileSidebarOpen(true);
  };

  const handleMobileSidebarClose = (): void => {
    setIsMobileSidebarOpen(false);
    setIsAccountMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <AppSidebar
          mode="desktop"
          navigationItems={navigationItems}
          isOpen
          accountMenuRef={desktopAccountMenuRef}
          accountContent={
            <AccountMenu
              isOpen={isAccountMenuOpen}
              userName={userName}
              userEmail={userEmail}
              userInitials={userInitials}
              activeView={auth.activeView}
              availableViews={auth.availableViews}
              onToggle={handleAccountMenuToggle}
              onProfileClick={handleProfileNavigation}
              onViewChange={handleViewChange}
              onLogout={handleLogout}
            />
          }
        />

        <AppSidebar
          ref={mobileSidebarRef}
          mode="mobile"
          navigationItems={navigationItems}
          isOpen={isMobileSidebarOpen}
          onClose={handleMobileSidebarClose}
          accountMenuRef={mobileAccountMenuRef}
          accountContent={
            <AccountMenu
              isOpen={isAccountMenuOpen}
              userName={userName}
              userEmail={userEmail}
              userInitials={userInitials}
              activeView={auth.activeView}
              availableViews={auth.availableViews}
              onToggle={handleAccountMenuToggle}
              onProfileClick={handleProfileNavigation}
              onViewChange={handleViewChange}
              onLogout={handleLogout}
            />
          }
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={handleMobileSidebarOpen}
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-6 w-6 text-black/90" strokeWidth={2.1} />
            </button>

            <div className="text-sm font-semibold text-slate-950">
              Codfish United
            </div>

            <div className="w-9" />
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export { AuthenticatedLayout };
