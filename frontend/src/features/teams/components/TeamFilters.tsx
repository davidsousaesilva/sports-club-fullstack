import { FiltersBar } from "../../../shared/components/filters/FiltersBar";
import { SearchInput } from "../../../shared/components/filters/SearchInput";
import { FilterSelect } from "../../../shared/components/filters/FilterSelect";

import type {
  TeamActiveFilter,
  TeamModalityOption,
  TeamType,
} from "../model/team.types";

interface TeamsFiltersProps {
  searchValue: string;
  activeFilter: TeamActiveFilter;
  teamTypeFilter: TeamType | "ALL";
  modalityIdFilter: number | undefined;
  modalities: TeamModalityOption[];
  onSearchChange: (value: string) => void;
  onActiveFilterChange: (value: TeamActiveFilter) => void;
  onTeamTypeFilterChange: (value: TeamType | "ALL") => void;
  onModalityFilterChange: (value: number | undefined) => void;
}

function TeamsFilters({
  searchValue,
  activeFilter,
  teamTypeFilter,
  modalityIdFilter,
  modalities,
  onSearchChange,
  onActiveFilterChange,
  onTeamTypeFilterChange,
  onModalityFilterChange,
}: TeamsFiltersProps) {
  return (
    <FiltersBar cols={4}>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Pesquisar por equipa ou modalidade"
      />

      <FilterSelect
        value={activeFilter}
        onChange={(value) => onActiveFilterChange(value as TeamActiveFilter)}
        placeholder="Estado"
        options={[
          { value: "ALL", label: "Todos os estados" },
          { value: "ACTIVE", label: "Ativas" },
          { value: "INACTIVE", label: "Inativas" },
        ]}
      />

      <FilterSelect
        value={teamTypeFilter}
        onChange={(value) => onTeamTypeFilterChange(value as TeamType | "ALL")}
        placeholder="Tipo de equipa"
        options={[
          { value: "ALL", label: "Todos os tipos" },
          { value: "TEAM", label: "Equipa" },
          { value: "INDIVIDUAL", label: "Individual" },
        ]}
      />

      <FilterSelect
        value={modalityIdFilter ? String(modalityIdFilter) : "ALL"}
        onChange={(value) =>
          onModalityFilterChange(value === "ALL" ? undefined : Number(value))
        }
        placeholder="Modalidade"
        options={[
          { value: "ALL", label: "Todas as modalidades" },
          ...modalities.map((modality) => ({
            value: String(modality.id),
            label: modality.name,
          })),
        ]}
      />
    </FiltersBar>
  );
}

export { TeamsFilters };
