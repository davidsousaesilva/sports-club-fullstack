import { MapPin, Users } from "lucide-react";

import { FiltersBar } from "../../../../shared/components/filters/FiltersBar";
import { SearchInput } from "../../../../shared/components/filters/SearchInput";
import { FilterSelect } from "../../../../shared/components/filters/FilterSelect";

import type { ClubComplex } from "../../../sportscore/model/club-settings.types";
import type { TeamSummary } from "../../../teams/model/team.types";
import type { TemporalStatus } from "../../model/training/training.types";

interface TrainingFiltersProps {
  searchValue: string;
  teamIdFilter?: number;
  complexIdFilter?: number;
  statusFilter: TemporalStatus | "ALL";
  teams: TeamSummary[];
  complexes: ClubComplex[];
  onSearchChange: (value: string) => void;
  onTeamChange: (value?: number) => void;
  onComplexChange: (value?: number) => void;
  onStatusChange: (value: TemporalStatus | "ALL") => void;
}

function TrainingFilters({
  searchValue,
  teamIdFilter,
  complexIdFilter,
  statusFilter,
  teams,
  complexes,
  onSearchChange,
  onTeamChange,
  onComplexChange,
  onStatusChange,
}: TrainingFiltersProps) {
  return (
    <FiltersBar cols={4}>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Pesquisar por treino ou equipa"
      />

      <FilterSelect
        value={teamIdFilter ? String(teamIdFilter) : "ALL"}
        onChange={(value) =>
          onTeamChange(value === "ALL" ? undefined : Number(value))
        }
        placeholder="Equipa"
        icon={<Users className="h-4 w-4 text-slate-400" />}
        options={[
          { value: "ALL", label: "Todas as equipas ativas" },
          ...teams.map((team) => ({
            value: String(team.id),
            label: team.name,
          })),
        ]}
      />

      <FilterSelect
        value={complexIdFilter ? String(complexIdFilter) : "ALL"}
        onChange={(value) =>
          onComplexChange(value === "ALL" ? undefined : Number(value))
        }
        placeholder="Complexo"
        icon={<MapPin className="h-4 w-4 text-slate-400" />}
        options={[
          { value: "ALL", label: "Todos os complexos" },
          ...complexes.map((complex) => ({
            value: String(complex.id),
            label: complex.name,
          })),
        ]}
      />

      <FilterSelect
        value={statusFilter}
        onChange={(value) => onStatusChange(value as TemporalStatus | "ALL")}
        placeholder="Estado"
        options={[
          { value: "ALL", label: "Todos os estados" },
          { value: "FUTURE", label: "Agendado" },
          { value: "IN_PROGRESS", label: "Em curso" },
          { value: "PAST", label: "Terminado" },
        ]}
      />
    </FiltersBar>
  );
}

export { TrainingFilters };
