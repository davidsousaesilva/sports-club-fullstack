import { UserRound } from "lucide-react";

import type { Role } from "../../../../lib/constants/roles";
import { roleLabels } from "../../../../lib/constants/roles";
import type { CalendarScopeMode } from "../../model/calendar/calendar.types";

type CalendarScopeSummaryProps = {
  activeRole: Role | null;
  userName: string | null;
  isScopeSelectable: boolean;
  scopeMode: CalendarScopeMode;
  onScopeModeChange: (mode: CalendarScopeMode) => void;
};

function CalendarScopeSummary({
  activeRole,
  userName,
  isScopeSelectable,
  scopeMode,
  onScopeModeChange,
}: CalendarScopeSummaryProps) {
  if (!isScopeSelectable || !activeRole) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-white px-4 py-4">
      <div className="inline-flex w-fit rounded-xl border border-blue-200 bg-white p-1">
        <button
          type="button"
          onClick={() => onScopeModeChange("FULL")}
          className={[
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            scopeMode === "FULL"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-100",
          ].join(" ")}
        >
          Vista completa
        </button>
        <button
          type="button"
          onClick={() => onScopeModeChange("SCOPED")}
          className={[
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            scopeMode === "SCOPED"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-100",
          ].join(" ")}
        >
          Vista filtrada
        </button>
      </div>
    </div>
  );
}

export { CalendarScopeSummary };
