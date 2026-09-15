import { ListFilter, Tag } from "lucide-react";

import { FiltersBar } from "../../../shared/components/filters/FiltersBar";
import { FilterSelect } from "../../../shared/components/filters/FilterSelect";
import { SearchInput } from "../../../shared/components/filters/SearchInput";
import type {
  FeeFilterStatus,
  FeeFilterType,
  FinanceScope,
} from "../model/finance.types";

type FinanceFeeFiltersProps = {
  scope: FinanceScope;
  selectedStatus: FeeFilterStatus;
  selectedType: FeeFilterType;
  athleteSearch: string;
  onStatusChange: (value: FeeFilterStatus) => void;
  onTypeChange: (value: FeeFilterType) => void;
  onAthleteSearchChange: (value: string) => void;
};

const feeStatusOptions: { value: FeeFilterStatus; label: string }[] = [
  { value: "ALL", label: "Todos os estados" },
  { value: "UNPAID", label: "Por pagar" },
  { value: "PAID", label: "Paga" },
  { value: "DEBT", label: "Em dívida" },
];

const feeTypeOptions: { value: FeeFilterType; label: string }[] = [
  { value: "ALL", label: "Todos os tipos" },
  { value: "REGISTRATION", label: "Inscrição" },
  { value: "MONTHLYFEE", label: "Quota mensal" },
  { value: "COMPETITIONFEE", label: "Taxa de competição" },
];

function FinanceFeeFilters({
  scope,
  selectedStatus,
  selectedType,
  athleteSearch,
  onStatusChange,
  onTypeChange,
  onAthleteSearchChange,
}: FinanceFeeFiltersProps) {
  return (
    <FiltersBar cols={scope === "ATHLETE" ? 2 : 3}>
      {scope !== "ATHLETE" && (
        <SearchInput
          value={athleteSearch}
          onChange={onAthleteSearchChange}
          placeholder="Pesquisar por nome do atleta..."
        />
      )}

      <FilterSelect
        value={selectedStatus}
        onChange={(value) => onStatusChange(value as FeeFilterStatus)}
        placeholder="Estado"
        options={feeStatusOptions}
        icon={<ListFilter className="h-4 w-4 text-slate-400" />}
      />

      <FilterSelect
        value={selectedType}
        onChange={(value) => onTypeChange(value as FeeFilterType)}
        placeholder="Tipo"
        options={feeTypeOptions}
        icon={<Tag className="h-4 w-4 text-slate-400" />}
      />
    </FiltersBar>
  );
}

export { FinanceFeeFilters };
