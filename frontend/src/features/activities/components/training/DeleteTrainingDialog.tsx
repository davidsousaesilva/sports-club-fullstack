import { DeleteConfirmationDialog } from "../../../../shared/components/ui/dialog/DeleteConfirmationDialog";
import type { Training } from "../../model/training/training.types";

interface DeleteTrainingDialogProps {
  open: boolean;
  training: Training | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

function DeleteTrainingDialog({
  open,
  training,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteTrainingDialogProps) {
  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar treino"
      description={`Esta ação removerá permanentemente "${training?.description ?? "este treino"}".`}
      confirmLabel={isDeleting ? "A eliminar..." : "Eliminar"}
      onConfirm={() => {
        void onConfirm();
      }}
    />
  );
}

export { DeleteTrainingDialog };
