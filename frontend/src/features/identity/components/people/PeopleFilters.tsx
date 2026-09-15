import { Filter, Search } from "lucide-react";

import { Input } from "../../../../shared/components/ui/input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select/Select";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import type { PersonActiveFilter, PersonRole } from "../../model/person.types";

interface PeopleFiltersProps {
  searchValue: string;
  roleFilter: PersonRole | "ALL";
  activeFilter: PersonActiveFilter;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: PersonRole | "ALL") => void;
  onActiveFilterChange: (value: PersonActiveFilter) => void;
}

const roleOptions = [
  { value: "ALL", label: "Todos os papéis" },
  { value: "ATHLETE", label: "Atletas" },
  { value: "COACH", label: "Treinadores" },
  { value: "EMPLOYEE", label: "Funcionários" },
  { value: "MANAGER", label: "Gestores" },
];

const activeOptions = [
  { value: "ALL", label: "Todos os estados" },
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
];

function PeopleFilters({
  searchValue,
  roleFilter,
  activeFilter,
  onSearchChange,
  onRoleFilterChange,
  onActiveFilterChange,
}: PeopleFiltersProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="grid items-center gap-4 xl:grid-cols-[minmax(0,1.5fr)_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-10 pl-9"
              placeholder="Pesquisar por nome ou email..."
            />
          </div>

          <Select
            value={roleFilter}
            onValueChange={(value) =>
              onRoleFilterChange(value as PersonRole | "ALL")
            }
          >
            <SelectTrigger className="h-10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Papel" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={activeFilter}
            onValueChange={(value) =>
              onActiveFilterChange(value as PersonActiveFilter)
            }
          >
            <SelectTrigger className="h-10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Estado" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {activeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export { PeopleFilters };
