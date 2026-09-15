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
          "flex flex-col border-slate-200 bg-white",
          isMobile
            ? "fixed inset-y-0 left-0 z-50 h-dvh w-80 max-w-[85vw] border-r transition-transform duration-200 lg:hidden"
            : "hidden h-screen w-65 shrink-0 border-r lg:sticky lg:top-0 lg:flex",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : undefined,
        )}
      >
        {isMobile ? (
          <div className="shrink-0 flex items-center justify-end border-b border-slate-200 px-4 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Fechar menu de navegação"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        <div className="shrink-0 border-b border-slate-200 px-6 pb-5 pt-6">
          <Link to={appPaths.calendar} className="block overflow-hidden">
            <div className="relative aspect-[5/2] w-full bg-slate-900">
              <img
                src="/club-mark.png"
                alt="Imagem do clube"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/10" />
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">
          <AppNavigation items={navigationItems} />
        </div>

        <div
          ref={accountMenuRef}
          className="relative z-50 shrink-0 overflow-visible border-t border-slate-200 p-4"
        >
          {accountContent}
        </div>
      </aside>
    </>
  );
});

export { AppSidebar };
