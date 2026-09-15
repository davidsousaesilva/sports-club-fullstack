import { forwardRef, type ReactNode } from "react";
import { Link } from "react-router";
import { X } from "lucide-react";

import { appPaths } from "../../app/router/paths";
import type { NavigationItem } from "../hooks/navigation";
import { cn } from "../../lib/utils/cn";
import { AppNavigation } from "./AppNavigation";

type AppSidebarProps = {
  mode: "desktop" | "mobile";
  navigationItems: NavigationItem[];
  isOpen: boolean;
  onClose?: () => void;
  accountMenuRef: React.RefObject<HTMLDivElement>;
  accountContent: ReactNode;
};

const AppSidebar = forwardRef<HTMLElement, AppSidebarProps>(function AppSidebar(
  { mode, navigationItems, isOpen, onClose, accountMenuRef, accountContent },
  ref,
) {
  const isMobile = mode === "mobile";

  return (
    <>
      {/* overlay mobile */}
      {isMobile && isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        ref={ref}
        className={cn(
          "h-screen flex flex-col bg-white border-slate-200",
          isMobile
            ? "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r transition-transform duration-200 lg:hidden"
            : "hidden w-65 shrink-0 border-r lg:flex",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : undefined,
        )}
      >
        {/* MOBILE HEADER */}
        {isMobile ? (
          <div className="flex items-center justify-end border-b border-slate-200 px-4 py-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        {/* LOGO */}
        <div className="border-b border-slate-200 px-6 pb-5 pt-6 shrink-0">
          <Link to={appPaths.calendar} className="block overflow-hidden">
            <div className="relative aspect-[5/2] w-full bg-slate-900">
              <img
                src="/src/features/landing/assets/club-mark.png"
                alt="Club banner"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/10" />
            </div>
          </Link>
        </div>

        {/* NAVIGATION (ONLY SCROLL AREA) */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <AppNavigation items={navigationItems} />
        </div>

        {/* ACCOUNT AREA (FIXED, NOT SCROLLABLE) */}
        <div
          ref={accountMenuRef}
          className="relative shrink-0 border-t border-slate-200 p-4 overflow-visible z-50"
        >
          {accountContent}
        </div>
      </aside>
    </>
  );
});

export { AppSidebar };
