import { CircleUserRound, ChevronDown, Eye, LogOut } from "lucide-react";
import {
  roles,
  type Role,
  roleLabels,
  roleColorClasses,
} from "../../lib/constants/roles";
import { cn } from "../../lib/utils/cn";

type AccountMenuProps = {
  isOpen: boolean;
  userName: string;
  userEmail: string;
  userInitials: string;
  activeView: Role | null;
  availableViews: Role[];
  onToggle: () => void;
  onProfileClick: () => void;
  onViewChange: (role: Role) => void;
  onLogout: () => void;
};

function AccountMenu({
  isOpen,
  userName,
  userEmail,
  userInitials,
  activeView,
  availableViews,
  onToggle,
  onProfileClick,
  onViewChange,
  onLogout,
}: AccountMenuProps) {
  const orderedAvailableViews = [...availableViews].sort(
    (a, b) => roles.indexOf(a) - roles.indexOf(b),
  );

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute bottom-[calc(100%+0.75rem)] left-0 right-0 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-slate-950">Minha conta</p>
          </div>

          <div className="border-t border-slate-200">
            <button
              type="button"
              onClick={onProfileClick}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <CircleUserRound className="h-4 w-4" />
              Ver perfil
            </button>
          </div>

          <div className="border-t border-slate-200 px-4 py-2 text-sm text-slate-500">
            Mudar vista
          </div>

          <div className="border-t border-slate-200">
            {orderedAvailableViews.map((role) => {
              const isActive = activeView === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => onViewChange(role)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-1.5 text-sm",
                    isActive
                      ? "bg-blue-50 text-slate-950"
                      : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Eye className="h-4 w-4" />
                    {roleLabels[role]}
                  </span>

                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isActive && role
                        ? roleColorClasses[role]
                        : "bg-transparent",
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Terminar sessão
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 hover:bg-slate-50"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-black/90 to-blue-900 font-semibold text-white">
          {userInitials}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950">
              {userName}
            </p>

            <div className="flex items-center gap-2">
              {activeView && (
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${roleColorClasses[activeView]}`}
                />
              )}

              <p className="truncate text-sm text-slate-500">
                {activeView ? roleLabels[activeView] : userEmail}
              </p>
            </div>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
    </div>
  );
}

export { AccountMenu };
