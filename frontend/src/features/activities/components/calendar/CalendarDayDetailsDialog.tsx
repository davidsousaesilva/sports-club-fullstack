import {
  CalendarDays,
  Clock3,
  MapPin,
  Shield,
  Trophy,
  Users,
} from "lucide-react";

import {
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui";
import type { CalendarActivity } from "../../model/calendar/calendar.types";

type CalendarDayDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateLabel: string;
  activities: CalendarActivity[];
};

function getTypeStyles(type: CalendarActivity["type"]) {
  switch (type) {
    case "TRAINING":
      return {
        badgeClassName: "border border-violet-200 bg-violet-50 text-violet-700",
        label: "Treino",
      };
    case "EVENT":
      return {
        badgeClassName:
          "border border-emerald-200 bg-emerald-50 text-emerald-700",
        label: "Evento",
      };
    default:
      return {
        badgeClassName: "border border-slate-200 bg-slate-100 text-slate-700",
        label: "Atividade",
      };
  }
}

function formatTimeRange(start: string, end: string | null) {
  const startDate = new Date(start);
  const startTime = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!end) {
    return startTime;
  }

  const endDate = new Date(end);
  const endTime = endDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
}

function formatTeamNames(teamNames?: string[] | null) {
  if (!teamNames || teamNames.length === 0) {
    return "Sem equipas atribuídas";
  }

  return teamNames.join(", ");
}

function CalendarDayDetailsDialog({
  open,
  onOpenChange,
  dateLabel,
  activities,
}: CalendarDayDetailsDialogProps) {
  const sortedActivities = [...activities].sort(
    (left, right) =>
      new Date(left.start).getTime() - new Date(right.start).getTime(),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-slate-700" />
            {dateLabel}
          </DialogTitle>
          <DialogDescription>
            Agenda diária com todas as atividades registadas.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
          {sortedActivities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <CalendarDays className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">
                Não há atividades agendadas para este dia.
              </p>
            </div>
          ) : (
            sortedActivities.map((activity) => {
              const typeStyles = getTypeStyles(activity.type);

              return (
                <Card key={`${activity.type}-${activity.id}`} className="p-4">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div
                          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles.badgeClassName}`}
                        >
                          {typeStyles.label}
                        </div>
                        <h3 className="text-base font-semibold text-slate-950">
                          {activity.description}
                        </h3>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <Clock3 className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Hora
                          </p>
                          <p className="text-sm text-slate-800">
                            {formatTimeRange(activity.start, activity.end)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <Trophy className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Modalidade
                          </p>
                          <p className="text-sm text-slate-800">
                            {activity.modalityName ?? "Não definida"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 sm:col-span-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Local
                          </p>
                          <p className="text-sm text-slate-800">
                            {activity.location ?? "Local não definido"}
                          </p>
                        </div>
                      </div>

                      {activity.type === "TRAINING" ? (
                        <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 sm:col-span-2">
                          <Shield className="mt-0.5 h-4 w-4 text-slate-500" />
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Equipa
                            </p>
                            <p className="text-sm text-slate-800">
                              {activity.teamName ?? "Sem equipa atribuída"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 sm:col-span-2">
                            <Users className="mt-0.5 h-4 w-4 text-slate-500" />
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Equipas
                              </p>
                              <p className="text-sm text-slate-800">
                                {formatTeamNames(activity.teamNames)}
                              </p>
                            </div>
                          </div>

                          {activity.competitionName ? (
                            <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 sm:col-span-2">
                              <Trophy className="mt-0.5 h-4 w-4 text-slate-500" />
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                  Competição
                                </p>
                                <p className="text-sm text-slate-800">
                                  {activity.competitionName}
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { CalendarDayDetailsDialog };