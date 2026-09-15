import { useState } from "react";

import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import { AthleteAttendanceList } from "../components/selfGuidedTraining/AthleteAttendanceList";
import { SelfGuidedTrainingFilters } from "../components/selfGuidedTraining/SelfGuidedTrainingFilters";
import { SelfGuidedTrainingStats } from "../components/selfGuidedTraining/SelfGuidedTrainingStats";
import { useFreeTrainings } from "../hooks/use-free-trainings";

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date {
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function getWeekRange(selectedDate: string): { start: Date; end: Date } {
  const date = parseDateInput(selectedDate);
  const dayOfWeek = date.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const sundayOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const start = new Date(date);
  start.setDate(date.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setDate(date.getDate() + sundayOffset);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function formatWeekRangeLabel(selectedDate: string): string {
  const { start, end } = getWeekRange(selectedDate);
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function formatLongDate(value: string): string {
  const date = parseDateInput(value);

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function SelfGuidedTrainingPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateInput(new Date()),
  );

  const freeTrainingsQuery = useFreeTrainings({
    selectedDate,
  });

  const weekRangeLabel = formatWeekRangeLabel(selectedDate);
  const selectedDateLabel = formatLongDate(selectedDate);

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-950">
            Treino livre
          </h1>
          <p className="text-sm text-slate-600">
            Regista presenças de treino livre por equipa e data.
          </p>
        </div>
      </header>

      <SelfGuidedTrainingStats stats={freeTrainingsQuery.stats} />

      <Card>
        <CardContent className="space-y-4 p-6">
          <SelfGuidedTrainingFilters
            teams={freeTrainingsQuery.teams}
            selectedTeamId={freeTrainingsQuery.selectedTeamId}
            selectedDate={selectedDate}
            selectedTeam={freeTrainingsQuery.selectedTeam}
            isLoading={freeTrainingsQuery.isLoading}
            error={freeTrainingsQuery.error}
            onTeamChange={freeTrainingsQuery.setSelectedTeamId}
            onDateChange={setSelectedDate}
            weekRangeLabel={weekRangeLabel}
            selectedDateLabel={selectedDateLabel}
          />

          {freeTrainingsQuery.selectedTeam &&
          freeTrainingsQuery.maxWeeklyAttendances !== null ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-700">
                Cada atleta desta equipa pode registar até{" "}
                <span className="font-semibold text-slate-950">
                  {freeTrainingsQuery.maxWeeklyAttendances}
                </span>{" "}
                presenças de treino livre por semana.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <AthleteAttendanceList
        selectedTeam={freeTrainingsQuery.selectedTeam}
        athletes={freeTrainingsQuery.athletes}
        selectedDateLabel={selectedDateLabel}
        isLoading={freeTrainingsQuery.isLoading}
        isSavingByAthlete={freeTrainingsQuery.isSavingByAthlete}
        maxWeeklyAttendances={freeTrainingsQuery.maxWeeklyAttendances}
        getWeeklyCount={freeTrainingsQuery.getWeeklyCount}
        hasAttendanceOnSelectedDay={
          freeTrainingsQuery.hasAttendanceOnSelectedDay
        }
        hasReachedWeeklyLimit={freeTrainingsQuery.hasReachedWeeklyLimit}
        onMarkAttendance={freeTrainingsQuery.markAttendance}
      />
    </section>
  );
}

export { SelfGuidedTrainingPage };
