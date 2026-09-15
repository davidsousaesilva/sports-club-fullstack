import { useMemo, useState } from "react";

import { TeamMembersSection } from "./TeamMembersSection";
import type { Team, TeamMember, TeamRoleCandidate } from "../model/team.types";

interface TeamMembersManagerProps {
  team: Team;
  athletes: TeamRoleCandidate[];
  coaches: TeamRoleCandidate[];
  isAddingAthlete: boolean;
  isAddingCoach: boolean;
  isEndingMembership: boolean;
  onAddAthlete: (teamId: number, personId: number) => Promise<void>;
  onAddCoach: (teamId: number, personId: number) => Promise<void>;
  onEndMembership: (teamId: number, teamMember: TeamMember) => Promise<void>;
}

function TeamMembersManager({
  team,
  athletes,
  coaches,
  isAddingAthlete,
  isAddingCoach,
  isEndingMembership,
  onAddAthlete,
  onAddCoach,
  onEndMembership,
}: TeamMembersManagerProps) {
  const [selectedAthleteId, setSelectedAthleteId] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState("");

  const activeAthletes = useMemo(
    () =>
      team.members.filter(
        (member) =>
          member.relationship === "ATHLETE" && member.endDate === null,
      ),
    [team.members],
  );

  const activeCoaches = useMemo(
    () =>
      team.members.filter(
        (member) => member.relationship === "COACH" && member.endDate === null,
      ),
    [team.members],
  );

  const availableAthletes = useMemo(
    () =>
      athletes.filter(
        (candidate) =>
          !activeAthletes.some((member) => member.personId === candidate.id),
      ),
    [activeAthletes, athletes],
  );

  const availableCoaches = useMemo(
    () =>
      coaches.filter(
        (candidate) =>
          !activeCoaches.some((member) => member.personId === candidate.id),
      ),
    [activeCoaches, coaches],
  );

  const isIndividualTeam = team.teamType === "INDIVIDUAL";
  const canAddMoreAthletes = !isIndividualTeam || activeAthletes.length === 0;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <TeamMembersSection
        title="Atletas"
        description="Gere a composição de atletas desta equipa."
        emptyLabel="Não existem atletas ativos."
        selectPlaceholder="Selecionar atleta"
        candidates={availableAthletes}
        members={activeAthletes}
        selectedCandidateId={selectedAthleteId}
        addDisabled={!canAddMoreAthletes}
        isAdding={isAddingAthlete}
        isEnding={isEndingMembership}
        warning={
          isIndividualTeam
            ? "As equipas individuais só podem ter um atleta ativo."
            : undefined
        }
        onSelectedCandidateChange={setSelectedAthleteId}
        onAdd={async () => {
          if (!selectedAthleteId) {
            return;
          }

          await onAddAthlete(team.id, Number(selectedAthleteId));
          setSelectedAthleteId("");
        }}
        onEndMembership={async (teamMember) => {
          await onEndMembership(team.id, teamMember);
        }}
      />

      <TeamMembersSection
        title="Treinadores"
        description="Gere a composição técnica desta equipa."
        emptyLabel="Não existem treinadores ativos."
        selectPlaceholder="Selecionar treinador"
        candidates={availableCoaches}
        members={activeCoaches}
        selectedCandidateId={selectedCoachId}
        isAdding={isAddingCoach}
        isEnding={isEndingMembership}
        onSelectedCandidateChange={setSelectedCoachId}
        onAdd={async () => {
          if (!selectedCoachId) {
            return;
          }

          await onAddCoach(team.id, Number(selectedCoachId));
          setSelectedCoachId("");
        }}
        onEndMembership={async (teamMember) => {
          await onEndMembership(team.id, teamMember);
        }}
      />
    </div>
  );
}

export { TeamMembersManager };