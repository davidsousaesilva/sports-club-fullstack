import { useMemo, useState } from "react";
import { Activity, Plus } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { DeleteConfirmationDialog } from "../../../shared/components/ui/dialog/DeleteConfirmationDialog";
import { ModalitiesFilters } from "../components/modalities/ModalitiesFilters";
import { ModalityCard } from "../components/modalities/ModalityCard";
import { ModalityDetailDialog } from "../components/modalities/ModalityDetailDialog";
import { ModalityFormDialog } from "../components/modalities/ModalityFormDialog";
import { ModalitiesStats } from "../components/modalities/ModalitiesStats";
import { useModalities } from "../hooks/use-modalities";
import type {
  Modality,
  ModalityFilterStatus,
  ModalitySummary,
} from "../model/modalities.types";

function ModalitiesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<ModalityFilterStatus>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedModality, setSelectedModality] = useState<Modality | null>(
    null,
  );
  const [selectedModalityId, setSelectedModalityId] = useState<number | null>(
    null,
  );
  const [detailModality, setDetailModality] = useState<Modality | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [modalityToDelete, setModalityToDelete] =
    useState<ModalitySummary | null>(null);

  const { modalities, isLoading, isDeleting, deleteModality, getModality } =
    useModalities();

  const filteredModalities = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return modalities.filter((modality) => {
      const matchesSearch =
        !normalizedSearch ||
        modality.name.toLowerCase().includes(normalizedSearch) ||
        modality.description.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "TRAINED" && modality.trained) ||
        (statusFilter === "UNTRAINED" && !modality.trained);

      return matchesSearch && matchesStatus;
    });
  }, [modalities, searchValue, statusFilter]);

  const trainedModalities = useMemo(() => {
    return modalities.filter((modality) => modality.trained);
  }, [modalities]);

  const untrainedModalities = useMemo(() => {
    return modalities.filter((modality) => !modality.trained);
  }, [modalities]);

  const handleCreate = () => {
    setSelectedModality(null);
    setSelectedModalityId(null);
    setDialogOpen(true);
  };

  const handleEdit = async (modalitySummary: ModalitySummary) => {
    setSelectedModalityId(modalitySummary.id);

    try {
      const modality = await getModality(modalitySummary.id);
      setSelectedModality(modality);
      setDialogOpen(true);
    } catch {
      setSelectedModality(null);
    }
  };

  const handleOpenDetails = async (modalitySummary: ModalitySummary) => {
    setSelectedModalityId(modalitySummary.id);
    setDetailDialogOpen(true);
    setIsDetailLoading(true);
    setDetailModality(null);

    try {
      const modality = await getModality(modalitySummary.id);
      setDetailModality(modality);
    } catch {
      setDetailModality(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modalityToDelete) {
      return;
    }

    await deleteModality(modalityToDelete.id);
    setModalityToDelete(null);

    if (selectedModalityId === modalityToDelete.id) {
      setSelectedModalityId(null);
      setSelectedModality(null);
      setDetailModality(null);
      setDetailDialogOpen(false);
    }
  };

  return (
    <>
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex max-w-full flex-col gap-1">
            <h1 className="text-2xl font-semibold text-slate-950">
              Modalidades
            </h1>
            <p className="text-sm text-slate-600">
              Gestão das modalidades desportivas do clube.
            </p>
          </div>

          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Criar modalidade
          </Button>
        </header>

        <ModalitiesStats
          totalCount={modalities.length}
          trainedCount={trainedModalities.length}
          untrainedCount={untrainedModalities.length}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <ModalitiesFilters
          searchValue={searchValue}
          statusFilter={statusFilter}
          onSearchChange={setSearchValue}
          onStatusFilterChange={setStatusFilter}
        />

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[320px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : filteredModalities.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredModalities.map((modality) => (
              <ModalityCard
                key={modality.id}
                modality={modality}
                onViewDetails={handleOpenDetails}
                onEdit={handleEdit}
                onDelete={setModalityToDelete}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <Activity className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h2 className="text-lg font-semibold text-slate-900">
              Nenhuma modalidade encontrada
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ajuste a pesquisa e os filtros ou crie uma nova modalidade.
            </p>
          </div>
        )}
      </section>

      <ModalityFormDialog
        open={dialogOpen}
        modality={selectedModality}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedModality(null);
            setSelectedModalityId(null);
          }
        }}
      />

      <ModalityDetailDialog
        open={detailDialogOpen}
        modality={detailModality}
        isLoading={isDetailLoading}
        onOpenChange={(open) => {
          setDetailDialogOpen(open);

          if (!open) {
            setDetailModality(null);
            setSelectedModalityId(null);
            setIsDetailLoading(false);
          }
        }}
      />

      <DeleteConfirmationDialog
        open={modalityToDelete !== null}
        title="Eliminar modalidade"
        description={
          modalityToDelete
            ? `Tem a certeza de que pretende eliminar "${modalityToDelete.name}"? Esta ação não pode ser anulada.`
            : ""
        }
        confirmLabel="Eliminar"
        isPending={isDeleting}
        onConfirm={handleDeleteConfirm}
        onOpenChange={(open) => {
          if (!open) {
            setModalityToDelete(null);
          }
        }}
      />
    </>
  );
}

export { ModalitiesPage };
