import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import { Button, Card } from "../../../shared/components/ui";
import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth";
import { CalendarDayDetailsDialog } from "../components/calendar/CalendarDayDetailsDialog";
import { CalendarGrid } from "../components/calendar/CalendarGrid";
import { CalendarScopeSummary } from "../components/calendar/CalendarScopeSummary";
import { useCalendar } from "../hooks/use-calendar";
import {
  getDayNames,
  getTodayDateKey,
} from "../model/calendar/calendar.mappers";
import type { CalendarScopeMode } from "../model/calendar/calendar.types";

function CalendarPage() {
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [scopeMode, setScopeMode] = useState<CalendarScopeMode>("SCOPED");

  const { user } = useCurrentUser();
  const { activeRole } = usePermissions();

  const {
    monthLabel,
    days,
    selectedDateActivities,
    selectedDateLabel,
    hasSelectedDate,
    isLoading,
    isFetching,
    isError,
    error,
    upcomingActivities,
    isScopeSelectable,
  } = useCalendar(referenceDate, selectedDateKey, scopeMode);

  const dayNames = useMemo(() => getDayNames(), []);

  function handlePreviousMonth() {
    setReferenceDate(
      (currentDate) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  }

  function handleNextMonth() {
    setReferenceDate(
      (currentDate) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  }

  function handleGoToToday() {
    setReferenceDate(new Date());
    setSelectedDateKey(getTodayDateKey());
    setIsDetailsOpen(true);
  }

  function handleDayClick(dateKey: string) {
    setSelectedDateKey(dateKey);
    setIsDetailsOpen(true);
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">
              Calendário
            </h1>
            <p className="text-sm text-slate-600">
              Agenda mensal de treinos, eventos e competições.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGoToToday}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Mês anterior</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Mês seguinte</span>
          </Button>
        </div>
      </header>

      <CalendarScopeSummary
        activeRole={activeRole}
        userName={user?.name ?? null}
        isScopeSelectable={isScopeSelectable}
        scopeMode={scopeMode}
        onScopeModeChange={setScopeMode}
      />

      {isLoading ? (
        <Card className="flex min-h-[20rem] items-center justify-center p-6">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <LoaderCircle className="h-5 w-5 animate-spin text-slate-400" />A
            carregar atividades do calendário...
          </div>
        </Card>
      ) : isError ? (
        <Card className="p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-950">
              Não foi possível carregar o calendário
            </h2>
            <p className="text-sm text-slate-600">
              {error?.message ??
                "Ocorreu um erro inesperado ao carregar os dados do calendário."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex min-h-[calc(100vh-11rem)] w-full flex-col space-y-4">
            {isFetching ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <LoaderCircle className="h-4 w-4 animate-spin" />A atualizar
                dados...
              </div>
            ) : null}

            <CalendarGrid
              monthLabel={monthLabel}
              dayNames={dayNames}
              days={days}
              onDayClick={handleDayClick}
            />
          </div>
      )}

      <CalendarDayDetailsDialog
        open={isDetailsOpen && hasSelectedDate}
        onOpenChange={setIsDetailsOpen}
        dateLabel={selectedDateLabel}
        activities={selectedDateActivities}
      />
    </section>
  );
}

export { CalendarPage };
