import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import { usePermissions } from "../../auth";
import { useModalities } from "../../sportscore/hooks/use-modalities";
import { TeamCard } from "../components/TeamCard";
import { TeamDetailsDialog } from "../components/TeamDetailsDialog";
import { TeamFormDialog } from "../components/TeamFormDialog";
import { TeamStats } from "../components/TeamStats";
import { TeamsFilters } from "../components/TeamFilters";
import { useTeamRoleCandidates, useTeams } from "../hooks/use-teams";
import type {
  Team,
  TeamActiveFilter,
  TeamMember,
  TeamModalityOption,
  TeamSummary,
  TeamType,
} from "../model/team.types";

function TeamsPage() {
  const { activeRole } = usePermissions();
  const canManageTeams = activeRole === "MANAGER" || activeRole === "EMPLOYEE";

  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<TeamActiveFilter>("ALL");
  const [teamTypeFilter, setTeamTypeFilter] = useState<TeamType | "ALL">("ALL");
  const [modalityIdFilter, setModalityIdFilter] = useState<number | undefined>(
    undefined,
  );
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [managedTeam, setManagedTeam] = useState<Team | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const modalitiesQuery = useModalities();
  const teamsQuery = useTeams({
    modalityId: modalityIdFilter,
    teamType: teamTypeFilter,
    active: activeFilter,
    teamOrModalityName: searchValue,
  });
  const candidatesQuery = useTeamRoleCandidates();

  const modalityOptions = useMemo<TeamModalityOption[]>(
    () =>
      modalitiesQuery.modalities.map((modality) => ({
        id: modality.id,
        name: modality.name,
      })),
    [modalitiesQuery.modalities],
  );

  const visibleModalities = useMemo(() => {
    const visibleModalityIds = new Set(
      teamsQuery.teams.map((team) => team.modalityId),
    );

    return modalityOptions.filter((modality) =>
      visibleModalityIds.has(modality.id),
    );
  }, [modalityOptions, teamsQuery.teams]);

  const stats = useMemo(() => {
    const totalTeams = teamsQuery.teams.length;
    const activeTeams = teamsQuery.teams.filter((team) => team.active).length;
    const inactiveTeams = totalTeams - activeTeams;

    return {
      totalTeams,
      activeTeams,
      inactiveTeams,
    };
  }, [teamsQuery.teams]);

  const handleCreate = () => {
    setManagedTeam(null);
    setFormOpen(true);
  };

  const handleManage = async (team: TeamSummary) => {
    const detailedTeam = await teamsQuery.getTeamDetails(team.id);
    setManagedTeam(detailedTeam);
    setFormOpen(true);
  };

  const handleViewDetails = async (team: TeamSummary) => {
    const detailedTeam = await teamsQuery.getTeamDetails(team.id);
    setSelectedTeam(detailedTeam);
    setDetailsOpen(true);
  };

  return (
    <>
      <section className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-950">Equipas</h1>
            <p className="text-sm text-slate-600">
              Listagem de equipas, filtros e gestão de membros.
            </p>
          </div>

          {canManageTeams && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Nova equipa
            </Button>
          )}
        </header>

        <TeamStats
          stats={stats}
          isLoading={teamsQuery.isLoading}
          onFilterSelect={setActiveFilter}
        />

        <TeamsFilters
          searchValue={searchValue}
          activeFilter={activeFilter}
          teamTypeFilter={teamTypeFilter}
          modalityIdFilter={modalityIdFilter}
          modalities={visibleModalities}
          onSearchChange={setSearchValue}
          onActiveFilterChange={setActiveFilter}
          onTeamTypeFilterChange={setTeamTypeFilter}
          onModalityFilterChange={setModalityIdFilter}
        />

        {teamsQuery.isLoading ? (
          <Card>
            <CardContent className="flex min-h-[220px] items-center justify-center gap-3 p-6 text-slate-500">
              <Users className="h-5 w-5" />
              <span className="text-sm">A carregar equipas...</span>
            </CardContent>
          </Card>
        ) : teamsQuery.teams.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-950">
                  Nenhuma equipa encontrada
                </h2>
                <p className="text-sm text-slate-500">
                  Ajuste os filtros atuais ou crie uma nova equipa.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {teamsQuery.teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                canManage={canManageTeams}
                onViewDetails={handleViewDetails}
                onManage={handleManage}
              />
            ))}
          </div>
        )}
      </section>

      <TeamDetailsDialog
        open={detailsOpen}
        team={selectedTeam}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            setSelectedTeam(null);
          }
        }}
      />

      <TeamFormDialog
        open={formOpen}
        team={managedTeam}
        modalities={modalityOptions}
        athletes={candidatesQuery.athletes}
        coaches={candidatesQuery.coaches}
        isSubmitting={teamsQuery.isCreating || teamsQuery.isUpdating}
        isAddingAthlete={teamsQuery.isAddingAthlete}
        isAddingCoach={teamsQuery.isAddingCoach}
        isEndingMembership={teamsQuery.isEndingMembership}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setManagedTeam(null);
          }
        }}
        onSubmit={async (values) => {
          if (managedTeam) {
            await teamsQuery.updateTeam({
              team: managedTeam,
              values,
            });
          } else {
            await teamsQuery.createTeam(values);
          }

          setFormOpen(false);
          setManagedTeam(null);
        }}
        onAddAthlete={async (teamId, personId) => {
          await teamsQuery.addAthlete({
            teamId,
            values: {
              personId,
              startDate: new Date().toISOString(),
            },
          });

          const refreshedTeam = await teamsQuery.getTeamDetails(teamId);
          setManagedTeam(refreshedTeam);
        }}
        onAddCoach={async (teamId, personId) => {
          await teamsQuery.addCoach({
            teamId,
            values: {
              personId,
              startDate: new Date().toISOString(),
            },
          });

          const refreshedTeam = await teamsQuery.getTeamDetails(teamId);
          setManagedTeam(refreshedTeam);
        }}
        onEndMembership={async (teamId, teamMember: TeamMember) => {
          await teamsQuery.endMembership({
            teamId,
            teamMember,
            values: {
              endDate: new Date().toISOString(),
            },
          });

          const refreshedTeam = await teamsQuery.getTeamDetails(teamId);
          setManagedTeam(refreshedTeam);
        }}
      />
    </>
  );
}

export { TeamsPage };