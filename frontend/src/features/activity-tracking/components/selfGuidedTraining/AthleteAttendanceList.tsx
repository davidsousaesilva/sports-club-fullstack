import { CalendarDays, CheckCircle2, Users } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import type { Team } from "../../../teams/model/team.types";

type AthleteMember = Team["members"][number];

interface AthleteAttendanceListProps {
  selectedTeam: Team | null;
  athletes: AthleteMember[];
  selectedDateLabel: string;
  isLoading: boolean;
  isSavingByAthlete: Record<number, boolean>;
  maxWeeklyAttendances: number | null;
  getWeeklyCount: (athleteId: number) => number;
  hasAttendanceOnSelectedDay: (athleteId: number) => boolean;
  hasReachedWeeklyLimit: (athleteId: number) => boolean;
  onMarkAttendance: (athlete: AthleteMember) => Promise<void>;
}

function AthleteAttendanceList({
  selectedTeam,
  athletes,
  selectedDateLabel,
  isLoading,
  isSavingByAthlete,
  maxWeeklyAttendances,
  getWeeklyCount,
  hasAttendanceOnSelectedDay,
  hasReachedWeeklyLimit,
  onMarkAttendance,
}: AthleteAttendanceListProps) {
  if (!selectedTeam) {
    return (
      <Card>
        <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-950">
              Nenhuma equipa selecionada
            </h2>
            <p className="text-sm text-slate-500">
              Escolhe uma equipa para consultar os atletas disponíveis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-[240px] items-center justify-center p-6 text-sm text-slate-500">
          A carregar treino autónomo...
        </CardContent>
      </Card>
    );
  }

  if (athletes.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-950">
              Nenhum atleta encontrado
            </h2>
            <p className="text-sm text-slate-500">
              Esta equipa não tem atletas ativos para registo de presença.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Atletas da equipa
            </h2>
            <p className="text-sm text-slate-500">
              {athletes.length} atleta{athletes.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4" />
            <span>{selectedDateLabel}</span>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {athletes.map((athlete) => {
            const weeklyCount = getWeeklyCount(athlete.personId);
            const isPresentToday = hasAttendanceOnSelectedDay(athlete.personId);
            const hasReachedLimit = hasReachedWeeklyLimit(athlete.personId);
            const isSaving = Boolean(isSavingByAthlete[athlete.personId]);
            const isDisabled = isSaving || hasReachedLimit;

            return (
              <div
                key={athlete.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${
                      isPresentToday ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  >
                    {athlete.personName.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-slate-950">
                      {athlete.personName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {weeklyCount} presença{weeklyCount === 1 ? "" : "s"} nesta
                      semana
                      {maxWeeklyAttendances !== null
                        ? ` / ${maxWeeklyAttendances}`
                        : ""}
                    </p>

                    {hasReachedLimit && !isPresentToday ? (
                      <p className="text-sm font-medium text-amber-700">
                        Limite semanal atingido.
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isPresentToday ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Presente</span>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => void onMarkAttendance(athlete)}
                      disabled={isDisabled}
                    >
                      {isSaving
                        ? "A guardar..."
                        : hasReachedLimit
                          ? "Limite semanal atingido"
                          : "Marcar presença"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export { AthleteAttendanceList };
