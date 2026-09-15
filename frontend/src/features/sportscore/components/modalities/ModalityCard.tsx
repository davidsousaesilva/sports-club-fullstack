import { CalendarRange, Edit3, Trash2 } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import type { ModalitySummary } from "../../model/modalities.types";

interface ModalityCardProps {
  modality: ModalitySummary;
  onViewDetails: (modality: ModalitySummary) => void;
  onEdit: (modality: ModalitySummary) => void;
  onDelete: (modality: ModalitySummary) => void;
}

function ModalityCard({
  modality,
  onViewDetails,
  onEdit,
  onDelete,
}: ModalityCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="border-b border-slate-200 bg-purple-300 p-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold text-slate-950">
                {modality.name}
              </h2>
              <span className="inline-flex rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700">
                {modality.trained ? "Com treino" : "Sem treino"}
              </span>
            </div>

            <p className="line-clamp-2 text-sm">
              {modality.description || "Sem descrição disponível."}
            </p>
          </div>

          <div className="rounded-lg bg-white/70 px-3 py-2 text-right backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Tipo de evento
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {modality.eventType}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-5 pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Modelo de treino</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              {modality.trained
                ? "Gerida por plano de treino"
                : "Presença livre"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-600">
              <CalendarRange className="h-4 w-4" />
              <span className="text-sm font-medium">Acesso semanal</span>
            </div>
            <p className="text-sm text-slate-900">
              {modality.trained
                ? "Definido pelo planeamento"
                : `${modality.maxWeeklyAttendances} presenças / semana`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-5">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(modality)}
          >
            Ver detalhes
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(modality)}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Editar
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            onClick={() => onDelete(modality)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { ModalityCard };
