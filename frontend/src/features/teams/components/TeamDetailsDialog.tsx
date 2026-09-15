import { ExternalLink, ShieldCheck, UserRound, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { appPaths } from "../../../app/router/paths";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog/Dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card/Card";
import type { Team } from "../model/team.types";

interface TeamDetailsDialogProps {
  open: boolean;
  team: Team | null;
  onOpenChange: (open: boolean) => void;
}

function TeamDetailsDialog({
  open,
  team,
  onOpenChange,
}: TeamDetailsDialogProps) {
  const navigate = useNavigate();

  if (!team) {
    return null;
  }

  const activeAthletes = team.members.filter(
    (member) => member.relationship === "ATHLETE" && member.endDate === null,
  );
  const activeCoaches = team.members.filter(
    (member) => member.relationship === "COACH" && member.endDate === null,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
          <DialogDescription>
            Detalhes da equipa, membros e estrutura atual.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informação geral</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Modalidade</p>
                <p className="mt-1 font-medium text-slate-950">
                  {team.modalityName}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Época</p>
                <p className="mt-1 font-medium text-slate-950">
                  {team.seasonYear}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tipo</p>
                <p className="mt-1 font-medium text-slate-950">
                  {team.teamType === "TEAM" ? "Equipa" : "Individual"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <p className="mt-1 font-medium text-slate-950">
                  {team.active ? "Ativa" : "Inativa"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Treinadores ({activeCoaches.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeCoaches.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Não existem treinadores atribuídos.
                </p>
              ) : (
                activeCoaches.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-slate-100"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`${appPaths.people}/${member.personId}`);
                    }}
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-950">
                        {member.personName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Desde {member.startDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <ShieldCheck className="h-4 w-4" />
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atletas ({activeAthletes.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAthletes.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Não existem atletas atribuídos.
                </p>
              ) : (
                activeAthletes.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-slate-100"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`${appPaths.people}/${member.personId}`);
                    }}
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-950">
                        {member.personName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Desde {member.startDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      {team.teamType === "TEAM" ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <UserRound className="h-4 w-4" />
                      )}
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { TeamDetailsDialog };
