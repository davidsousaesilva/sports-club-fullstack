import { AlertCircle } from "lucide-react";

import { Input } from "../../../../shared/components/ui/input/Input";
import { Label } from "../../../../shared/components/ui/input/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select/Select";
import type { Team, TeamSummary } from "../../../teams/model/team.types";

interface SelfGuidedTrainingFiltersProps {
  teams: TeamSummary[];
  selectedTeamId?: number;
  selectedDate: string;
  selectedTeam: Team | null;
  isLoading: boolean;
  error: string | null;
  onTeamChange: (teamId: number | undefined) => void;
  onDateChange: (value: string) => void;
  weekRangeLabel: string;
  selectedDateLabel: string;
}

function SelfGuidedTrainingFilters({
  teams,
  selectedTeamId,
  selectedDate,
  selectedTeam,
  isLoading,
  error,
  onTeamChange,
  onDateChange,
  weekRangeLabel,
  selectedDateLabel,
}: SelfGuidedTrainingFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-950">Filtros</h2>
        <p className="text-sm text-slate-500">
          Seleciona a equipa e o dia para consultar e registar presenças.
        </p>
      </div>

      <div className="grid items-center gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="team-select-trigger">Equipa</Label>
          <Select
            value={selectedTeamId ? String(selectedTeamId) : undefined}
            onValueChange={(value) => onTeamChange(Number(value))}
            disabled={isLoading || teams.length === 0}
          >
            <SelectTrigger
              id="team-select-trigger"
              className="h-11 rounded-xl border-slate-300"
            >
              <SelectValue placeholder="Selecionar equipa" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={String(team.id)}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendance-date">Data da presença</Label>
          <Input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </div>
      </div>

      {selectedTeam ? (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-sky-600" />
            <div className="space-y-1">
              <p className="font-medium text-sky-950">
                {selectedTeam.name} · {selectedTeam.modalityName}
              </p>
              <p className="text-sm text-sky-700">
                Semana em análise: {weekRangeLabel}
              </p>
              <p className="text-sm text-sky-700">
                Data selecionada: {selectedDateLabel}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}

export { SelfGuidedTrainingFilters };
