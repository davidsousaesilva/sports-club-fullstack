import { useEffect, useMemo, useState } from "react";
import { UserCheck, UserX } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog/Dialog";
import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import type {
  ActivityAttendanceTarget,
  ActivityMember,
  Attendance,
} from "../model/activity-records.types";

interface AttendanceDialogProps {
  open: boolean;
  title: string;
  description: string;
  members: ActivityMember[];
  attendances: Attendance[];
  target: ActivityAttendanceTarget;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    values: { athleteId: number; present: boolean }[],
  ) => Promise<void>;
}

function AttendanceDialog({
  open,
  title,
  description,
  members,
  attendances,
  target,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: AttendanceDialogProps) {
  const athleteMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          member.relationship === "ATHLETE" && member.endDate === null,
      ),
    [members],
  );

  const [attendanceMap, setAttendanceMap] = useState<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextState = athleteMembers.reduce<Record<number, boolean>>(
      (accumulator, member) => {
        const existingAttendance = attendances.find(
          (attendance) => attendance.athleteId === member.personId,
        );

        accumulator[member.personId] = existingAttendance?.present ?? false;
        return accumulator;
      },
      {},
    );

    setAttendanceMap(nextState);
  }, [attendances, athleteMembers, open]);

  const totalPresent = Object.values(attendanceMap).filter(Boolean).length;
  const totalAbsent = athleteMembers.length - totalPresent;

  const handleSave = async () => {
    await onSubmit(
      athleteMembers.map((member) => ({
        athleteId: member.personId,
        present: attendanceMap[member.personId] ?? false,
      })),
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-wrap items-center gap-4 p-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <UserCheck className="h-5 w-5" />
                <span className="font-semibold">{totalPresent} presentes</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <UserX className="h-5 w-5" />
                <span className="font-semibold">{totalAbsent} ausentes</span>
              </div>
              {target.teamName && (
                <div className="text-sm text-slate-500">{target.teamName}</div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() =>
                setAttendanceMap(
                  athleteMembers.reduce<Record<number, boolean>>(
                    (accumulator, member) => {
                      accumulator[member.personId] = true;
                      return accumulator;
                    },
                    {},
                  ),
                )
              }
            >
              Marcar todos como presentes
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() =>
                setAttendanceMap(
                  athleteMembers.reduce<Record<number, boolean>>(
                    (accumulator, member) => {
                      accumulator[member.personId] = false;
                      return accumulator;
                    },
                    {},
                  ),
                )
              }
            >
              Marcar todos como ausentes
            </Button>
          </div>

          <div className="space-y-3">
            {athleteMembers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-sm text-slate-500">
                  Não há atletas ativos disponíveis para esta atividade.
                </CardContent>
              </Card>
            ) : (
              athleteMembers.map((member) => {
                const present = attendanceMap[member.personId] ?? false;

                return (
                  <button
                    key={member.id}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                      present
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                    onClick={() =>
                      setAttendanceMap((current) => ({
                        ...current,
                        [member.personId]: !current[member.personId],
                      }))
                    }
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-950">
                        {member.personName}
                      </p>
                      <p className="text-xs text-slate-500">
                        ID do atleta #{member.personId}
                      </p>
                    </div>

                    {present ? (
                      <UserCheck className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <UserX className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={isSubmitting} onClick={() => void handleSave()}>
            Guardar presenças
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AttendanceDialog };
