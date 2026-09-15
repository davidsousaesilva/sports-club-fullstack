import { CalendarRange, Euro, Hash, Users } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import type { Modality } from "../../model/modalities.types";

interface ModalityDetailDialogProps {
  open: boolean;
  modality: Modality | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatAgeRange(ageMin: number | null, ageMax: number | null) {
  if (ageMin === null && ageMax === null) {
    return "Preço geral";
  }

  return `Faixa etária ${ageMin ?? 0} - ${ageMax ?? "ou mais"}`;
}

function ModalityDetailDialog({
  open,
  modality,
  isLoading,
  onOpenChange,
}: ModalityDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isLoading
              ? "A carregar modalidade..."
              : (modality?.name ?? "Detalhes da modalidade")}
          </DialogTitle>
          <DialogDescription>
            Informação completa da modalidade, incluindo estatísticas, regras de
            preços e equipas associadas.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : modality ? (
          <div className="space-y-6">
            <section className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Tipo de evento
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {modality.eventType}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Modelo de treino
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {modality.trained ? "Com treino" : "Sem treino"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarRange className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-wide">
                    Acesso semanal
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {modality.trained
                    ? "Gerido pelo plano de treino"
                    : `${modality.maxWeeklyAttendances} presenças / semana`}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Descrição
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {modality.description || "Sem descrição disponível."}
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Tipos de estatística
                </h3>
              </div>

              {modality.statisticTypes.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {modality.statisticTypes.map((statisticType) => (
                    <div
                      key={statisticType.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-slate-950">
                            {statisticType.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Unidade: {statisticType.unit}
                          </p>
                        </div>

                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            statisticType.mandatory
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-200 text-slate-600",
                          ].join(" ")}
                        >
                          {statisticType.mandatory ? "Obrigatória" : "Opcional"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Não existem tipos de estatística associados a esta modalidade.
                </div>
              )}
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Regras de preços
                </h3>
              </div>

              {modality.prices.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {modality.prices.map((price) => (
                    <div
                      key={price.id}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {formatAgeRange(price.ageMin, price.ageMax)}
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Taxa de inscrição
                          </p>
                          <p className="text-lg font-semibold text-emerald-700">
                            {price.registrationFee.toFixed(2)}€
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Mensalidade
                          </p>
                          <p className="text-lg font-semibold text-emerald-700">
                            {price.monthlyFee.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Não existem regras de preços definidas para esta modalidade.
                </div>
              )}
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Equipas
                </h3>
              </div>

              {modality.teams.length > 0 ? (
                <div className="space-y-2">
                  {modality.teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {team.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {team.teamType} · {team.seasonYear}
                        </p>
                      </div>

                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          team.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600",
                        ].join(" ")}
                      >
                        {team.active ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Não existem equipas associadas a esta modalidade.
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            Não foi possível carregar os detalhes da modalidade.
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ModalityDetailDialog };
