import { useMemo, useState } from "react";
import { useStatisticTypes } from "../hooks/use-statistic-types";
import { useComplexes } from "../hooks/use-complexes";
import {
  type ClubComplex,
  type StatisticType,
} from "../model/club-settings.types";
import { StatisticTypesSection } from "../components/club-settings/StatisticTypesSection";
import { ComplexesSection } from "../components/club-settings/ComplexesSection";
import { StatisticTypeFormDialog } from "../components/club-settings/StatisticTypeFormDialog";
import { ComplexFormDialog } from "../components/club-settings/ComplexFormDialog";
import { DeleteConfirmationDialog } from "../../../shared/components/ui";

type DeleteTarget =
  | { type: "statistic-type"; item: StatisticType }
  | { type: "complex"; item: ClubComplex }
  | null;

function ClubSettingsPage() {
  const [statisticTypeSearch, setStatisticTypeSearch] = useState("");
  const [complexSearch, setComplexSearch] = useState("");
  const [statisticTypeDialogOpen, setStatisticTypeDialogOpen] = useState(false);
  const [complexDialogOpen, setComplexDialogOpen] = useState(false);
  const [editingStatisticType, setEditingStatisticType] =
    useState<StatisticType | null>(null);
  const [editingComplex, setEditingComplex] = useState<ClubComplex | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const {
    statisticTypes,
    isLoading: isStatisticTypesLoading,
    isDeleting: isDeletingStatisticType,
    deleteStatisticType,
  } = useStatisticTypes();

  const {
    complexes,
    isLoading: isComplexesLoading,
    isDeleting: isDeletingComplex,
    deleteComplex,
  } = useComplexes();

  const filteredStatisticTypes = useMemo(() => {
    const normalizedSearch = statisticTypeSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return statisticTypes;
    }

    return statisticTypes.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.unit.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [statisticTypeSearch, statisticTypes]);

  const filteredComplexes = useMemo(() => {
    const normalizedSearch = complexSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return complexes;
    }

    return complexes.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.address.toLowerCase().includes(normalizedSearch) ||
        item.phone.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [complexSearch, complexes]);

  const handleCreateStatisticType = () => {
    setEditingStatisticType(null);
    setStatisticTypeDialogOpen(true);
  };

  const handleEditStatisticType = (item: StatisticType) => {
    setEditingStatisticType(item);
    setStatisticTypeDialogOpen(true);
  };

  const handleCreateComplex = () => {
    setEditingComplex(null);
    setComplexDialogOpen(true);
  };

  const handleEditComplex = (item: ClubComplex) => {
    setEditingComplex(item);
    setComplexDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    if (deleteTarget.type === "statistic-type") {
      await deleteStatisticType(deleteTarget.item.id);
    } else {
      await deleteComplex(deleteTarget.item.id);
    }

    setDeleteTarget(null);
  };

  const isDeletePending =
    (deleteTarget?.type === "statistic-type" && isDeletingStatisticType) ||
    (deleteTarget?.type === "complex" && isDeletingComplex);

  return (
    <>
      <section className="space-y-6">
        <header className="space-y-2">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-950">
              Configurações
            </h1>
            <p className="text-sm text-slate-600">
              Gerir tipos de estatística e complexos desportivos.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 md:flex-row md:justify-center">
          <StatisticTypesSection
            items={filteredStatisticTypes}
            totalCount={statisticTypes.length}
            searchValue={statisticTypeSearch}
            onSearchChange={setStatisticTypeSearch}
            onCreate={handleCreateStatisticType}
            onEdit={handleEditStatisticType}
            onDelete={(item) =>
              setDeleteTarget({ type: "statistic-type", item })
            }
            isLoading={isStatisticTypesLoading}
          />

          <ComplexesSection
            items={filteredComplexes}
            totalCount={complexes.length}
            searchValue={complexSearch}
            onSearchChange={setComplexSearch}
            onCreate={handleCreateComplex}
            onEdit={handleEditComplex}
            onDelete={(item) => setDeleteTarget({ type: "complex", item })}
            isLoading={isComplexesLoading}
          />
        </div>
      </section>

      <StatisticTypeFormDialog
        open={statisticTypeDialogOpen}
        statisticType={editingStatisticType}
        onOpenChange={(open) => {
          setStatisticTypeDialogOpen(open);

          if (!open) {
            setEditingStatisticType(null);
          }
        }}
      />

      <ComplexFormDialog
        open={complexDialogOpen}
        complex={editingComplex}
        onOpenChange={(open) => {
          setComplexDialogOpen(open);

          if (!open) {
            setEditingComplex(null);
          }
        }}
      />

      <DeleteConfirmationDialog
        open={deleteTarget !== null}
        title={
          deleteTarget?.type === "statistic-type"
            ? "Eliminar tipo de estatística"
            : "Eliminar complexo"
        }
        description={
          deleteTarget?.type === "statistic-type"
            ? `Tem a certeza de que pretende eliminar "${deleteTarget.item.name}"? Esta ação não pode ser anulada.`
            : `Tem a certeza de que pretende eliminar "${deleteTarget?.item.name}"? Esta ação não pode ser anulada.`
        }
        confirmLabel="Eliminar"
        isPending={Boolean(isDeletePending)}
        onConfirm={handleConfirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}

export { ClubSettingsPage };
