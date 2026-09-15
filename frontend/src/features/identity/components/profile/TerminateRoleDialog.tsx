import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog/Dialog";
import { Label } from "../../../../shared/components/ui/input/Label";
import { Textarea } from "../../../../shared/components/ui/textarea/Textarea";
import type {
  PersonRoleItem,
  TerminateRoleFormValues,
} from "../../model/person.types";

interface TerminateRoleDialogProps {
  open: boolean;
  role: PersonRoleItem | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TerminateRoleFormValues) => Promise<void>;
}

function TerminateRoleDialog({
  open,
  role,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: TerminateRoleDialogProps) {
  const [values, setValues] = useState<TerminateRoleFormValues>({
    endJustification: "",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      endJustification: "",
    });
  }, [open, role]);

  const isSubmitDisabled = useMemo(() => {
    return !values.endJustification.trim() || isSubmitting || !role;
  }, [isSubmitting, role, values.endJustification]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Terminar cargo</DialogTitle>
          <DialogDescription>
            Termine o cargo selecionado e registe a respetiva justificação.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="terminate-role-justification">
              Justificação de término
            </Label>
            <Textarea
              id="terminate-role-justification"
              value={values.endJustification}
              onChange={(event) =>
                setValues({
                  endJustification: event.target.value,
                })
              }
              rows={4}
              disabled={isSubmitting}
              placeholder="Descreva o motivo pelo qual este cargo está a ser terminado..."
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? "A terminar..." : "Terminar cargo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { TerminateRoleDialog };
