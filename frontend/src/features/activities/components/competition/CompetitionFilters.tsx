import { Filter, Layers3, Trophy, User } from "lucide-react";

import { FiltersBar } from "../../../../shared/components/filters/FiltersBar";
import { FilterSelect } from "../../../../shared/components/filters/FilterSelect";
import { SearchInput } from "../../../../shared/components/filters/SearchInput";
import type { ModalitySummary } from "../../../sportscore/model/modalities.types";
import type {
  CoachCompetitionScope,
  CompetitionTemporalStatus,
} from "../../model/competition/competition.types";

interface CompetitionFiltersProps {
  searchValue: string;
  modalityIdFilter?: number;
  statusFilter: CompetitionTemporalStatus;
  coachScope: CoachCompetitionScope;
  showCoachScopeFilter: boolean;
  modalities: ModalitySummary[];
  onSearchChange: (value: string) => void;
  onModalityChange: (value?: number) => void;
  onStatusChange: (value: CompetitionTemporalStatus) => void;
  onCoachScopeChange: (value: CoachCompetitionScope) => void;
}

function CompetitionFilters({
  searchValue,
  modalityIdFilter,
  statusFilter,
  coachScope,
  showCoachScopeFilter,
  modalities,
  onSearchChange,
  onModalityChange,
  onStatusChange,
  onCoachScopeChange,
}: CompetitionFiltersProps) {
  return (
    <FiltersBar cols={showCoachScopeFilter ? 4 : 3}>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Pesquisar por competição, descrição ou modalidade"
      />

      <FilterSelect
        value={modalityIdFilter ? String(modalityIdFilter) : "ALL"}
        onChange={(value) =>
          onModalityChange(value === "ALL" ? undefined : Number(value))
        }
        placeholder="Modalidade"
        icon={<Trophy className="h-4 w-4 text-slate-400" />}
        options={[
          { value: "ALL", label: "Todas as modalidades" },
          ...modalities.map((modality) => ({
            value: String(modality.id),
            label: modality.name,
          })),
        ]}
      />

      <FilterSelect
        value={statusFilter}
        onChange={(value) => onStatusChange(value as CompetitionTemporalStatus)}
        placeholder="Estado"
        icon={<Filter className="h-4 w-4 text-slate-400" />}
        options={[
          { value: "ALL", label: "Todos os estados" },
          { value: "FUTURE", label: "Agendada" },
          { value: "IN_PROGRESS", label: "Em curso" },
          { value: "PAST", label: "Terminada" },
        ]}
      />

      {showCoachScopeFilter ? (
        <FilterSelect
          value={coachScope}
          onChange={(value) =>
            onCoachScopeChange(value as CoachCompetitionScope)
          }
          placeholder="Âmbito"
          icon={
            coachScope === "MINE" ? (
              <User className="h-4 w-4 text-slate-400" />
            ) : (
              <Layers3 className="h-4 w-4 text-slate-400" />
            )
          }
          options={[
            { value: "ALL", label: "Todas as competições" },
            { value: "MINE", label: "As minhas competições" },
          ]}
        />
      ) : null}
    </FiltersBar>
  );
}

export { CompetitionFilters };
