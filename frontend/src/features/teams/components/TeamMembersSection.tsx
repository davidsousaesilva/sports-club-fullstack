import { UserMinus, UserPlus } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/components/ui/select/Select";
import type { TeamMember, TeamRoleCandidate } from "../model/team.types";

interface TeamMembersSectionProps {
  title: string;
  description: string;
  emptyLabel: string;
  selectPlaceholder: string;
  candidates: TeamRoleCandidate[];
  members: TeamMember[];
  selectedCandidateId: string;
  addDisabled?: boolean;
  isAdding: boolean;
  isEnding: boolean;
  warning?: string;
  onSelectedCandidateChange: (value: string) => void;
  onAdd: () => Promise<void>;
  onEndMembership: (teamMember: TeamMember) => Promise<void>;
}

function TeamMembersSection({
  title,
  description,
  emptyLabel,
  selectPlaceholder,
  candidates,
  members,
  selectedCandidateId,
  addDisabled = false,
  isAdding,
  isEnding,
  warning,
  onSelectedCandidateChange,
  onAdd,
  onEndMembership,
}: TeamMembersSectionProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-950">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        {warning && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {warning}
          </div>
        )}

        <div className="flex gap-2">
          <Select
            value={selectedCandidateId}
            onValueChange={onSelectedCandidateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((candidate) => (
                <SelectItem key={candidate.id} value={String(candidate.id)}>
                  {candidate.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            disabled={!selectedCandidateId || addDisabled || isAdding}
            onClick={() => void onAdd()}
          >
            <UserPlus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-2">
          {members.length === 0 ? (
            <p className="text-sm text-slate-500">{emptyLabel}</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-950">
                    {member.personName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Desde {member.startDate}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={isEnding}
                  onClick={() => void onEndMembership(member)}
                >
                  <UserMinus className="h-4 w-4" />
                  Terminar
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { TeamMembersSection };