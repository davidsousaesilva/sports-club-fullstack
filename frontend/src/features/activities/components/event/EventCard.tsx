import {
  CalendarDays,
  Clock3,
  Edit3,
  Eye,
  MapPin,
  Percent,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import { resolveEventTemporalStatus } from "../../model/event/event.mappers";
import type { EventSummary } from "../../model/event/event.types";

interface EventCardProps {
  event: EventSummary;
  canManage: boolean;
  onViewDetails: (event: EventSummary) => void;
  onEdit: (event: EventSummary) => void | Promise<void>;
  onManage: (event: EventSummary) => void | Promise<void>;
  onManageAttendance?: (event: EventSummary) => void | Promise<void>;
  onManagePerformances?: (event: EventSummary) => void | Promise<void>;
}

function formatDateTime(value: string): string {
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

function EventCard({
  event,
  canManage,
  onViewDetails,
  onEdit,
  onManage,
  onManageAttendance,
  onManagePerformances,
}: EventCardProps) {
  const status = resolveEventTemporalStatus(event.date);

  const statusLabel =
    status === "FUTURE"
      ? "Agendado"
      : status === "IN_PROGRESS"
        ? "Em curso"
        : "Terminado";

  const statusTone =
    status === "FUTURE"
      ? "bg-sky-100 text-sky-700"
      : status === "IN_PROGRESS"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-700";

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <div className="border-b border-slate-200 bg-orange-400/70 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h2 className="truncate text-lg font-semibold text-slate-950">
              {event.description}
            </h2>
            <p className="text-sm 0">{event.modalityName}</p>
            <p className="line-clamp-1 text-sm">
              {event.competitionName ?? "Sem competição associada"}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">Agendamento:</span>
            <span className="truncate text-slate-900">
              {formatDateTime(event.date)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">Complexo:</span>
            <span className="truncate text-slate-900">
              {event.complexName ?? "Sem complexo atribuído"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">Duração:</span>
            <span className="text-slate-900">{event.duration} minutos</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Trophy className="h-4 w-4 shrink-0" />
            <span className="font-medium text-slate-700">Equipas:</span>
            <span className="text-slate-900">{event.teamsCount}</span>
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
              {formatPercent(event.presentAthletesPercent)}
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
              {formatPercent(event.performanceEntriesPercent)}
            </p>
          </div>
        </div>

        {canManage ? (
          <>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void onEdit(event)}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Editar
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => void onManage(event)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Gerir equipas
              </Button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void onManageAttendance?.(event)}
              >
                <Users className="mr-2 h-4 w-4" />
                Presenças
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => void onManagePerformances?.(event)}
              >
                <Percent className="mr-2 h-4 w-4" />
                Desempenhos
              </Button>
            </div>
          </>
        ) : null}

        <div className="flex gap-2 border-t border-slate-200 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(event)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { EventCard };
