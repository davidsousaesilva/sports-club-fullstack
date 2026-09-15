import { BarChart3, Edit3, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import { Input } from "../../../../shared/components/ui/input/Input";
import type { StatisticType } from "../../model/club-settings.types";

interface StatisticTypesSectionProps {
  items: StatisticType[];
  totalCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (item: StatisticType) => void;
  onDelete: (item: StatisticType) => void;
  isLoading?: boolean;
}

function StatisticTypesSection({
  items,
  totalCount,
  searchValue,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: StatisticTypesSectionProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="space-y-4 border-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-slate-950">
                Tipos de estatística
              </CardTitle>
              <p className="text-sm text-slate-500">
                Gere as estatísticas disponíveis para as modalidades (
                {totalCount})
              </p>
            </div>
          </div>

          <Button onClick={onCreate} className="w-full lg:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar tipo de estatística
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Pesquisar tipos de estatística..."
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">
                        {item.name}
                      </h3>

                      {item.mandatory ? (
                        <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                          Obrigatória
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                          Opcional
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-500">
                      Unidade:{" "}
                      <span className="font-medium text-slate-700">
                        {item.unit}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onEdit(item)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onDelete(item)}
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              Não foram encontrados tipos de estatística.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Ajusta a pesquisa ou cria um novo tipo de estatística.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { StatisticTypesSection };
