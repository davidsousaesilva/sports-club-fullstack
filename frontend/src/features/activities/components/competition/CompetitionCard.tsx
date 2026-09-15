import {
  CalendarDays,
  Euro,
  Eye,
  Medal,
  Pencil,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import { resolveCompetitionTemporalStatus } from "../../model/competition/competition.mappers";
import type { CompetitionSummary } from "../../model/competition/competition.types";

interface CompetitionCardProps {
  competition: CompetitionSummary;
  canManage: boolean;
  onViewDetails: (competition: CompetitionSummary) => void;
  onEdit: (competition: CompetitionSummary) => void | Promise<void>;
  onManage: (competition: CompetitionSummary) => void | Promise<void>;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function CompetitionCard({
  competition,
  canManage,
  onViewDetails,
  onEdit,
  onManage,
}: CompetitionCardProps) {
  const status = resolveCompetitionTemporalStatus(
    competition.startDate,
    competition.endDate,
  );

  const statusLabel =
    status === "FUTURE"
      ? "Agendada"
      : status === "IN_PROGRESS"
        ? "Em curso"
        : "Terminada";

  const statusTone =
    status === "FUTURE"
      ? "bg-sky-100 text-sky-700"
      : status === "IN_PROGRESS"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-700";

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex items-start justify-between gap-4 bg-red-400/90 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-950">
            {competition.name}
          </h2>

          <p className="text-sm">{competition.modalityName}</p>
        </div>

        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone}`}
        >
          {statusLabel}
        </span>
      </div>

      <CardContent className="flex flex-col gap-5 p-6">
        <p className="line-clamp-3 text-sm text-slate-600">
          {competition.description}
        </p>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span>
              {formatDate(competition.startDate)} -{" "}
              {formatDate(competition.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-slate-400" />
            <span>
              {competition.registrationFee > 0
                ? `${competition.registrationFee.toFixed(2)} €`
                : "Inscrição gratuita"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span>{competition.registeredTeamsCount} equipas inscritas</span>
          </div>

          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-slate-400" />
            <span>{competition.eventCount} eventos associados</span>
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-2">
          {canManage ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => void onEdit(competition)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => void onManage(competition)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Gerir equipas
              </Button>
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(competition)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { CompetitionCard };
