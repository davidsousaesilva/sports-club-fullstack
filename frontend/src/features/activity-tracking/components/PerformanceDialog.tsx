import { useEffect, useMemo, useState } from "react";
import { Award, BarChart3, Save, Star, TrendingUp, User } from "lucide-react";

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
import { Input } from "../../../shared/components/ui/input/Input";
import { Label } from "../../../shared/components/ui/input/Label";
import type {
  ActivityMember,
  ActivityPerformanceTarget,
  ActivityStatisticType,
  Attendance,
  Performance,
  PerformanceEntryFormValue,
} from "../model/activity-records.types";

interface PerformanceDialogProps {
  open: boolean;
  title: string;
  description: string;
  members: ActivityMember[];
  statisticTypes: ActivityStatisticType[];
  attendances: Attendance[];
  performances: Performance[];
  target: ActivityPerformanceTarget;
  isSubmitting: boolean;
  readOnly?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    values: { athleteId: number; entries: PerformanceEntryFormValue[] }[],
  ) => Promise<void>;
}

function PerformanceDialog({
  open,
  title,
  description,
  members,
  statisticTypes,
  attendances,
  performances,
  isSubmitting,
  readOnly = false,
  onOpenChange,
  onSubmit,
}: PerformanceDialogProps) {
  const eligibleAthletes = useMemo(
    () =>
      members.filter(
        (member) =>
          member.relationship === "ATHLETE" && member.endDate === null,
      ),
    [members],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<
    Record<number, PerformanceEntryFormValue[]>
  >({});

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextState = eligibleAthletes.reduce<
      Record<number, PerformanceEntryFormValue[]>
    >((accumulator, athlete) => {
      accumulator[athlete.personId] = statisticTypes.map((statisticType) => {
        const existingPerformance = performances.find(
          (performance) =>
            performance.athleteId === athlete.personId &&
            performance.statisticTypeId === statisticType.id,
        );

        return {
          statisticTypeId: statisticType.id,
          value: existingPerformance ? String(existingPerformance.value) : "",
          note: existingPerformance?.note ?? "",
        };
      });

      return accumulator;
    }, {});

    setFormState(nextState);
    setIsEditing(false);
  }, [eligibleAthletes, open, performances, statisticTypes]);

  const summary = useMemo(() => {
    const allValues = performances.map((performance) => performance.value);
    const totalAthletes = new Set(
      performances.map((performance) => performance.athleteId),
    ).size;

    if (allValues.length === 0) {
      return {
        average: 0,
        best: 0,
        totalAthletes,
      };
    }

    const average =
      allValues.reduce((sum, value) => sum + value, 0) / allValues.length;
    const best = Math.max(...allValues);

    return {
      average,
      best,
      totalAthletes,
    };
  }, [performances]);

  const attendanceSummary = useMemo(() => {
    const presentCount = attendances.filter(
      (attendance) => attendance.present,
    ).length;

    return {
      presentCount,
      totalAttendanceRecords: attendances.length,
      totalEligibleAthletes: eligibleAthletes.length,
    };
  }, [attendances, eligibleAthletes.length]);

  const handleFieldChange = (
    athleteId: number,
    statisticTypeId: number,
    field: "value" | "note",
    value: string,
  ) => {
    setFormState((current) => ({
      ...current,
      [athleteId]: (current[athleteId] ?? []).map((entry) =>
        entry.statisticTypeId === statisticTypeId
          ? { ...entry, [field]: value }
          : entry,
      ),
    }));
  };

  const handleSave = async () => {
    await onSubmit(
      eligibleAthletes.map((athlete) => ({
        athleteId: athlete.personId,
        entries: formState[athlete.personId] ?? [],
      })),
    );

    setIsEditing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isEditing && summary.totalAthletes > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-xl bg-blue-100 p-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Média</p>
                    <p className="text-2xl font-bold text-slate-950">
                      {summary.average.toFixed(1)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-xl bg-emerald-100 p-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Melhor resultado</p>
                    <p className="text-2xl font-bold text-slate-950">
                      {summary.best.toFixed(1)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-xl bg-violet-100 p-2">
                    <User className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Atletas avaliados</p>
                    <p className="text-2xl font-bold text-slate-950">
                      {summary.totalAthletes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardContent className="flex flex-col gap-2 p-4 text-sm text-slate-600">
              <p>
                Atletas elegíveis:{" "}
                <span className="font-medium text-slate-950">
                  {attendanceSummary.totalEligibleAthletes}
                </span>
              </p>
              <p>
                Registos de presença:{" "}
                <span className="font-medium text-slate-950">
                  {attendanceSummary.totalAttendanceRecords}
                </span>
              </p>
              <p>
                Atletas presentes:{" "}
                <span className="font-medium text-slate-950">
                  {attendanceSummary.presentCount}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                O registo de desempenhos é independente do registo de presenças.
              </p>
            </CardContent>
          </Card>

          {statisticTypes.length > 0 && (
            <Card>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      Tipos de estatística configurados
                    </p>
                    <p className="text-sm text-slate-600">
                      {statisticTypes.map((item) => item.name).join(" • ")}
                    </p>
                  </div>
                </div>

                {!readOnly && !isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    <Save className="h-4 w-4" />
                    Editar desempenhos
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {eligibleAthletes.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <Star className="mx-auto mb-4 h-10 w-10 text-slate-400" />
                <p className="text-sm text-slate-500">
                  Não há atletas elegíveis para registo de desempenhos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {eligibleAthletes.map((athlete) => {
                const athletePerformances = performances.filter(
                  (performance) => performance.athleteId === athlete.personId,
                );
                const entries = formState[athlete.personId] ?? [];

                return (
                  <Card key={athlete.id}>
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-950">
                            {athlete.personName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            ID do atleta #{athlete.personId}
                          </p>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          {statisticTypes.map((statisticType) => {
                            const currentEntry = entries.find(
                              (entry) =>
                                entry.statisticTypeId === statisticType.id,
                            );

                            return (
                              <div
                                key={statisticType.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                              >
                                <div className="space-y-3">
                                  <div>
                                    <Label
                                      htmlFor={`value-${athlete.id}-${statisticType.id}`}
                                    >
                                      {statisticType.name}
                                    </Label>
                                    <Input
                                      id={`value-${athlete.id}-${statisticType.id}`}
                                      type="number"
                                      value={currentEntry?.value ?? ""}
                                      onChange={(event) =>
                                        handleFieldChange(
                                          athlete.personId,
                                          statisticType.id,
                                          "value",
                                          event.target.value,
                                        )
                                      }
                                      placeholder={statisticType.unit}
                                    />
                                  </div>

                                  <div>
                                    <Label
                                      htmlFor={`note-${athlete.id}-${statisticType.id}`}
                                    >
                                      Nota
                                    </Label>
                                    <Input
                                      id={`note-${athlete.id}-${statisticType.id}`}
                                      value={currentEntry?.note ?? ""}
                                      onChange={(event) =>
                                        handleFieldChange(
                                          athlete.personId,
                                          statisticType.id,
                                          "note",
                                          event.target.value,
                                        )
                                      }
                                      placeholder="Breve nota de avaliação"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : athletePerformances.length === 0 ? (
                        <p className="text-sm italic text-slate-500">
                          Não há desempenhos registados.
                        </p>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {athletePerformances.map((performance) => (
                            <div
                              key={performance.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {performance.statisticTypeName}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {performance.note}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-slate-950">
                                    {performance.value}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {performance.statisticTypeUnit}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              onOpenChange(false);
            }}
          >
            {isEditing ? "Cancelar" : "Fechar"}
          </Button>
          {isEditing && !readOnly && (
            <Button disabled={isSubmitting} onClick={() => void handleSave()}>
              Guardar desempenhos
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { PerformanceDialog };
