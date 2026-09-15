import { Filter } from "lucide-react";

import { FiltersBar } from "../../../../shared/components/filters/FiltersBar";
import { SearchInput } from "../../../../shared/components/filters/SearchInput";
import { FilterSelect } from "../../../../shared/components/filters/FilterSelect";

import type { ModalityFilterStatus } from "../../model/modalities.types";

interface ModalitiesFiltersProps {
  searchValue: string;
  statusFilter: ModalityFilterStatus;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: ModalityFilterStatus) => void;
}

function ModalitiesFilters({
  searchValue,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: ModalitiesFiltersProps) {
  return (
    <FiltersBar cols={2}>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Pesquisar por nome ou descrição..."
      />

      <FilterSelect
        value={statusFilter}
        onChange={(value) =>
          onStatusFilterChange(value as ModalityFilterStatus)
        }
        placeholder="Estado"
        icon={<Filter className="h-4 w-4 text-slate-400" />}
        options={[
          { value: "ALL", label: "Todas" },
          { value: "TRAINED", label: "Com treino" },
          { value: "UNTRAINED", label: "Sem treino" },
        ]}
      />
    </FiltersBar>
  );
}

export { ModalitiesFilters };
