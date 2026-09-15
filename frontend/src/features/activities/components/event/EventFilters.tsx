import { CalendarDays, Filter, Trophy, UserRound } from "lucide-react";

import { FiltersBar } from "../../../../shared/components/filters/FiltersBar";
import { FilterSelect } from "../../../../shared/components/filters/FilterSelect";
import { SearchInput } from "../../../../shared/components/filters/SearchInput";
import type { CompetitionSummary } from "../../model/competition/competition.types";
import type {
  CoachEventScope,
  EventTemporalStatus,
} from "../../model/event/event.types";

interface EventFiltersProps {
  searchValue: string;
  competitionIdFilter?: number;
  statusFilter: EventTemporalStatus;
  coachScope: CoachEventScope;
  showCoachScopeFilter: boolean;
  competitions: CompetitionSummary[];
  hideCompetitionFilter?: boolean;
  onSearchChange: (value: string) => void;
  onCompetitionChange: (value?: number) => void;
  onStatusChange: (value: EventTemporalStatus) => void;
  onCoachScopeChange: (value: CoachEventScope) => void;
}

function EventFilters({
  searchValue,
  competitionIdFilter,
  statusFilter,
  coachScope,
  showCoachScopeFilter,
  competitions,
  hideCompetitionFilter = false,
  onSearchChange,
  onCompetitionChange,
  onStatusChange,
  onCoachScopeChange,
}: EventFiltersProps) {
  const cols = hideCompetitionFilter
    ? showCoachScopeFilter
      ? 3
      : 2
    : showCoachScopeFilter
      ? 4
      : 3;

  return (
    <FiltersBar cols={cols}>
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Pesquisar por evento, descrição ou competição"
      />

      {!hideCompetitionFilter ? (
        <FilterSelect
          value={competitionIdFilter ? String(competitionIdFilter) : "ALL"}
          onChange={(value) =>
            onCompetitionChange(value === "ALL" ? undefined : Number(value))
          }
          placeholder="Competição"
          icon={<Trophy className="h-4 w-4 text-slate-400" />}
          options={[
            { value: "ALL", label: "Todas as competições" },
            ...competitions.map((competition) => ({
              value: String(competition.id),
              label: competition.name,
            })),
          ]}
        />
      ) : (
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4" />
          Filtrado pela competição atual
        </div>
      )}

      <FilterSelect
        value={statusFilter}
        onChange={(value) => onStatusChange(value as EventTemporalStatus)}
        placeholder="Estado"
        icon={<Filter className="h-4 w-4 text-slate-400" />}
        options={[
          { value: "ALL", label: "Todos os estados" },
          { value: "FUTURE", label: "Agendado" },
          { value: "IN_PROGRESS", label: "Em curso" },
          { value: "PAST", label: "Terminado" },
        ]}
      />

      {showCoachScopeFilter ? (
        <FilterSelect
          value={coachScope}
          onChange={(value) => onCoachScopeChange(value as CoachEventScope)}
          placeholder="Âmbito do treinador"
          icon={<UserRound className="h-4 w-4 text-slate-400" />}
          options={[
            { value: "ALL", label: "Todos os eventos" },
            { value: "MINE", label: "Os meus eventos" },
          ]}
        />
      ) : null}
    </FiltersBar>
  );
}

export { EventFilters };
