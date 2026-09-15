import { CalendarDays } from "lucide-react";

import { Card } from "../../../../shared/components/ui";
import type {
  CalendarActivity,
  CalendarDayCell,
} from "../../model/calendar/calendar.types";

type CalendarGridProps = {
  monthLabel: string;
  dayNames: string[];
  days: CalendarDayCell[];
  onDayClick: (dateKey: string) => void;
};

function getActivityPillStyles(type: CalendarActivity["type"]) {
  switch (type) {
    case "TRAINING":
      return "bg-violet-100 text-violet-700";
    case "EVENT":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function CalendarGrid({
  monthLabel,
  dayNames,
  days,
  onDayClick,
}: CalendarGridProps) {
  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-slate-600" />
          <h2 className="text-base font-semibold text-slate-950">
            {monthLabel}
          </h2>
        </div>
      </div>

      <div className="hidden border-b border-slate-200 bg-slate-50 md:grid md:grid-cols-7">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
          >
            {dayName}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-px bg-slate-200 md:grid-cols-7 md:grid-rows-6">
        {days.map((day) => {
          if (!day.dateKey) {
            return (
              <div
                key={day.id}
                className="hidden h-full min-h-[7.25rem] bg-slate-50 md:block"
                aria-hidden="true"
              />
            );
          }

          const dateKey = day.dateKey;
          const primaryActivity = day.activities[0] ?? null;
          const remainingActivitiesCount = Math.max(
            day.activities.length - 1,
            0,
          );

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onDayClick(dateKey)}
              className={[
                "flex h-full min-h-[6.5rem] flex-col overflow-hidden bg-white p-2.5 text-left transition-colors",
                "hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset",
                day.isToday ? "bg-black" : "",
              ].join(" ")}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className={[
                    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    day.isToday
                      ? "bg-black/90 text-white"
                      : "bg-slate-100 text-slate-700",
                  ].join(" ")}
                >
                  {day.dayOfMonth}
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {primaryActivity ? (
                  <div
                    className={`truncate rounded-lg px-2 py-1 text-[11px] font-medium ${getActivityPillStyles(primaryActivity.type)}`}
                    title={primaryActivity.description}
                  >
                    {primaryActivity.description}
                  </div>
                ) : null}

                {remainingActivitiesCount > 0 ? (
                  <p className="mt-1.5 text-[11px] font-medium text-slate-500">
                    +{remainingActivitiesCount} mais
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export { CalendarGrid };
