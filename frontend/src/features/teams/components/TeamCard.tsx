import { CalendarDays, UserRound, Users } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import type { TeamSummary } from "../model/team.types";

interface TeamCardProps {
  team: TeamSummary;
  canManage: boolean;
  onViewDetails: (team: TeamSummary) => void;
  onManage: (team: TeamSummary) => void;
}

function TeamCard({ team, canManage, onViewDetails, onManage }: TeamCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="border-b border-slate-200 bg-indigo-300 px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-950">
              {team.name}
            </h3>
            <p className="text-sm">{team.modalityName}</p>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              team.active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {team.active ? "Ativa" : "Inativa"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {team.seasonYear}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {team.teamType === "TEAM" ? (
              <Users className="h-4 w-4" />
            ) : (
              <UserRound className="h-4 w-4" />
            )}
            {team.teamType === "TEAM" ? "Equipa" : "Individual"}
          </span>
        </div>
      </div>

      <CardContent className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-blue-50 p-4 text-center">
            <Users className="m-1 h-4 w-4 text-orange-500" />
            <p className="text-2xl font-semibold text-slate-950">
              {team.athleteCount}
            </p>
            <p className="text-xs text-slate-600">Atletas</p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-violet-50 p-4 text-center">
            <Users className="m-1 h-4 w-4 text-blue-500" />
            <p className="text-2xl font-semibold text-slate-950">
              {team.coachCount}
            </p>
            <p className="text-xs text-slate-600">Treinadores</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(team)}
          >
            Ver detalhes
          </Button>

          {canManage && (
            <Button className="flex-1" onClick={() => onManage(team)}>
              Gerir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { TeamCard };
