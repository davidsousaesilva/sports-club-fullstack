import {
  CalendarDays,
  Clock3,
  Edit3,
  MapPin,
  Percent,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import type { TrainingSummary } from "../../model/training/training.types";

interface TrainingCardProps {
  training: TrainingSummary;
  onEdit?: (training: TrainingSummary) => void;
  onDelete?: (training: TrainingSummary) => void;
  onManageAttendance?: (training: TrainingSummary) => void;
  onManagePerformances?: (training: TrainingSummary) => void;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "N/D";
  }

  return `${value.toFixed(0)}%`;
}

function TrainingCard({
  training,
  onEdit,
  onDelete,
  onManageAttendance,
  onManagePerformances,
}: TrainingCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <div className="border-b border-slate-200 bg-blue-400/80 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h2 className="truncate text-lg font-semibold text-slate-950">
              {training.description}
            </h2>
            <p className="text-sm">{training.teamName}</p>
            {training.note ? (
              <p className="line-clamp-2 text-sm">{training.note}</p>
            ) : null}
          </div>

          <div className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Duração
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {training.duration} min
            </p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">Agendamento:</span>
            <span className="truncate text-slate-900">
              {formatDateTime(training.date)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">Complexo:</span>
            <span className="truncate text-slate-900">
              {training.complexName ?? "Sem complexo atribuído"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">Duração:</span>
            <span className="text-slate-900">{training.duration} minutos</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Presenças
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-950">
              {formatPercent(training.presentAthletesPercent)}
            </p>
          </div>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-slate-600">
              <Percent className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Desempenhos
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-950">
              {formatPercent(training.performanceEntriesPercent)}
            </p>
          </div>
        </div>

        {onManageAttendance || onManagePerformances ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {onManageAttendance ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onManageAttendance(training)}
              >
                <Users className="mr-2 h-4 w-4" />
                Presenças
              </Button>
            ) : null}

            {onManagePerformances ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onManagePerformances(training)}
              >
                <Percent className="mr-2 h-4 w-4" />
                Desempenhos
              </Button>
            ) : null}
          </div>
        ) : null}

        {onEdit || onDelete ? (
          <div className="flex gap-2 border-t border-slate-200 pt-4">
            {onEdit ? (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(training)}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Editar
              </Button>
            ) : null}

            {onDelete ? (
              <Button
                type="button"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => onDelete(training)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { TrainingCard };
