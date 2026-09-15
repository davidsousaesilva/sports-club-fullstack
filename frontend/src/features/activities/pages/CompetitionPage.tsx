import { useMemo, useState } from "react";
import { Plus, Trophy } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import { usePermissions } from "../../auth";
import { CompetitionCard } from "../components/competition/CompetitionCard";
import { CompetitionDetailsDialog } from "../components/competition/CompetitionDetailsDialog";
import { CompetitionFilters } from "../components/competition/CompetitionFilters";
import { CompetitionFormDialog } from "../components/competition/CompetitionFormDialog";
import { CompetitionStats } from "../components/competition/CompetitionStats";
import { CompetitionTeamsManagerDialog } from "../components/competition/CompetitionTeamsManagerDialog";
import { useCompetitions } from "../hooks/use-competitions";
import type {
  CoachCompetitionScope,
  Competition,
  CompetitionSummary,
  CompetitionTemporalStatus,
} from "../model/competition/competition.types";

function CompetitionPage() {
  const { activeRole } = usePermissions();
  const [searchValue, setSearchValue] = useState("");
  const [modalityIdFilter, setModalityIdFilter] = useState<
    number | undefined
  >();
  const [statusFilter, setStatusFilter] =
    useState<CompetitionTemporalStatus>("ALL");
  const [coachScope, setCoachScope] = useState<CoachCompetitionScope>("ALL");
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [selectedCompetitionSummary, setSelectedCompetitionSummary] =
    useState<CompetitionSummary | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const competitionsQuery = useCompetitions({
    modalityId: modalityIdFilter,
    status: statusFilter,
    coachScope,
    competitionNameOrDescriptionOrModality: searchValue,
  });

  const competitions = useMemo(
    () => competitionsQuery.competitions,
    [competitionsQuery.competitions],
  );

  const showCoachScopeFilter = activeRole === "COACH";

  function handleCreate() {
    setSelectedCompetition(null);
    setFormOpen(true);
  }

  async function handleViewDetails(competition: CompetitionSummary) {
    setSelectedCompetitionSummary(competition);
    setDetailsOpen(true);
  }

  function handleManage(competition: Competition) {
    setSelectedCompetition(competition);
    setManageOpen(true);
  }

  async function refreshSelectedCompetition(competitionId: number) {
    const refreshed = await competitionsQuery.getCompetitionDetails(
      competitionId,
    );

    setSelectedCompetition(refreshed);
  }

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-950">Competições</h1>
          <p className="text-sm text-slate-600">
            Agenda, consulta e gere competições por modalidade e período.
          </p>
        </div>

        {competitionsQuery.canManageCompetitions ? (
          <Button type="button" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nova competição
          </Button>
        ) : null}
      </header>

      <CompetitionStats
        stats={competitionsQuery.stats}
        isLoading={competitionsQuery.isLoading}
      />

      <CompetitionFilters
        searchValue={searchValue}
        modalityIdFilter={modalityIdFilter}
        statusFilter={statusFilter}
        coachScope={coachScope}
        showCoachScopeFilter={showCoachScopeFilter}
        modalities={competitionsQuery.modalities}
        onSearchChange={setSearchValue}
        onModalityChange={setModalityIdFilter}
        onStatusChange={setStatusFilter}
        onCoachScopeChange={setCoachScope}
      />

      {competitionsQuery.isLoading ? (
        <Card>
          <CardContent className="flex min-h-[240px] items-center justify-center p-6 text-sm text-slate-500">
            A carregar competições...
          </CardContent>
        </Card>
      ) : competitions.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-950">
                Não foram encontradas competições
              </h2>
              <p className="text-sm text-slate-500">
                Ajusta os filtros atuais ou cria uma nova competição.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              canManage={competitionsQuery.canManageCompetitions}
              onViewDetails={handleViewDetails}
              onEdit={async (competitionSummary) => {
                const detailedCompetition =
                  await competitionsQuery.getCompetitionDetails(
                    competitionSummary.id,
                  );

                setSelectedCompetition(detailedCompetition);
                setFormOpen(true);
              }}
              onManage={async (competitionSummary) => {
                const detailedCompetition =
                  await competitionsQuery.getCompetitionDetails(
                    competitionSummary.id,
                  );

                handleManage(detailedCompetition);
              }}
            />
          ))}
        </div>
      )}

      <CompetitionDetailsDialog
        open={detailsOpen}
        competitionId={selectedCompetitionSummary?.id ?? null}
        onOpenChange={setDetailsOpen}
        getCompetitionDetails={competitionsQuery.getCompetitionDetails}
      />

      <CompetitionFormDialog
        open={formOpen}
        competition={selectedCompetition}
        modalities={competitionsQuery.modalities}
        isSubmitting={
          competitionsQuery.isCreating || competitionsQuery.isUpdating
        }
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setSelectedCompetition(null);
          }
        }}
        onSubmit={async (values) => {
          if (selectedCompetition) {
            await competitionsQuery.updateCompetition({
              competition: selectedCompetition,
              values,
            });
          } else {
            await competitionsQuery.createCompetition(values);
          }

          setFormOpen(false);
          setSelectedCompetition(null);
        }}
      />

      <CompetitionTeamsManagerDialog
        open={manageOpen}
        competition={selectedCompetition}
        teams={competitionsQuery.teams}
        isSubmitting={
          competitionsQuery.isDeleting ||
          competitionsQuery.isEnrollingTeam ||
          competitionsQuery.isUpdatingCompetitionTeam ||
          competitionsQuery.isUnenrollingTeam
        }
        onOpenChange={setManageOpen}
        onDeleteCompetition={competitionsQuery.deleteCompetition}
        onEnrollTeam={async (input) => {
          await competitionsQuery.enrollTeam(input);
          await refreshSelectedCompetition(input.competitionId);
        }}
        onUnenrollTeam={async (input) => {
          await competitionsQuery.unenrollTeam(input);
          await refreshSelectedCompetition(input.competitionId);
        }}
        onUpdateCompetitionTeam={async (input) => {
          await competitionsQuery.updateCompetitionTeam(input);
          await refreshSelectedCompetition(input.competitionId);
        }}
      />
    </section>
  );
}

export { CompetitionPage };