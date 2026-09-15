import {
  Building2,
  Edit3,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import { Input } from "../../../../shared/components/ui/input/Input";
import type { ClubComplex } from "../../model/club-settings.types";

interface ComplexesSectionProps {
  items: ClubComplex[];
  totalCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (item: ClubComplex) => void;
  onDelete: (item: ClubComplex) => void;
  isLoading?: boolean;
}

function ComplexesSection({
  items,
  totalCount,
  searchValue,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: ComplexesSectionProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="space-y-4 border-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-slate-950">
                Complexos desportivos
              </CardTitle>
              <p className="text-sm text-slate-500">
                Gere as instalações e locais de treino do clube ({totalCount})
              </p>
            </div>
          </div>

          <Button onClick={onCreate} className="w-full lg:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar complexo
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Pesquisar complexos..."
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
                className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
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
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-950">
                      {item.name}
                    </h3>

                    <div className="space-y-2 text-sm text-slate-500">
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span>{item.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>{item.phone}</span>
                      </p>
                    </div>
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
              Não foram encontrados complexos.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Ajusta a pesquisa ou cria um novo complexo.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ComplexesSection };
