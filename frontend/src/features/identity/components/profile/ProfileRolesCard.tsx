import {
  AlertCircle,
  Award,
  CalendarDays,
  History,
  Plus,
  Star,
  X,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { PersonRoleItem, RoleHistoryItem } from "../../model/person.types";

interface ProfileRolesCardProps {
  activeRoles: PersonRoleItem[];
  temporalHistory: RoleHistoryItem[];
  canManageRoles: boolean;
  isMakingPrimaryRole: boolean;
  onAddRole: () => void;
  onMakePrimaryRole: (personRoleId: number) => Promise<void>;
  onTerminateRole: (role: PersonRoleItem) => void;
}

const roleLabels: Record<PersonRoleItem["role"], string> = {
  MANAGER: "Gerente",
  EMPLOYEE: "Colaborador",
  COACH: "Treinador",
  ATHLETE: "Atleta",
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("pt-PT");
}

function getRoleBadgeColor(role: PersonRoleItem["role"]) {
  switch (role) {
    case "MANAGER":
      return "bg-purple-100 text-purple-700";
    case "COACH":
      return "bg-blue-100 text-blue-700";
    case "EMPLOYEE":
      return "bg-emerald-100 text-emerald-700";
    case "ATHLETE":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function ProfileRolesCard({
  activeRoles,
  temporalHistory,
  canManageRoles,
  isMakingPrimaryRole,
  onAddRole,
  onMakePrimaryRole,
  onTerminateRole,
}: ProfileRolesCardProps) {
  const sortedActiveRoles = [...activeRoles].sort((left, right) => {
    if (left.primaryRole && !right.primaryRole) {
      return -1;
    }

    if (!left.primaryRole && right.primaryRole) {
      return 1;
    }

    return (
      new Date(right.startDate).getTime() - new Date(left.startDate).getTime()
    );
  });

  const primaryRole =
    sortedActiveRoles.find((role) => role.primaryRole) ??
    sortedActiveRoles[0] ??
    null;

  const secondaryRoles = sortedActiveRoles.filter((role) => !role.primaryRole);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-950">
              <Award className="h-5 w-5 text-blue-600" />
              Cargos ativos
            </CardTitle>

            {canManageRoles && (
              <Button variant="outline" size="sm" onClick={onAddRole}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar cargo
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          {!primaryRole ? (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4">
              <AlertCircle className="h-5 w-5 text-slate-400" />
              <p className="text-sm text-slate-600">Sem cargos ativos.</p>
            </div>
          ) : (
            <>
              <article className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Star className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor(
                          primaryRole.role,
                        )}`}
                      >
                        {roleLabels[primaryRole.role]}
                      </span>
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Principal
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Desde: {formatDate(primaryRole.startDate)}
                    </p>
                  </div>

                  {canManageRoles && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onTerminateRole(primaryRole)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </article>

              {secondaryRoles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Funções adicionais
                  </p>

                  {secondaryRoles.map((role) => (
                    <article
                      key={role.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                          <Award className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor(
                              role.role,
                            )}`}
                          >
                            {roleLabels[role.role]}
                          </span>

                          <p className="mt-2 text-sm text-slate-600">
                            Desde: {formatDate(role.startDate)}
                          </p>
                        </div>

                        {canManageRoles && (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={isMakingPrimaryRole}
                              onClick={() => onMakePrimaryRole(role.id)}
                            >
                              <Star className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => onTerminateRole(role)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-slate-200">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <History className="h-5 w-5 text-blue-600" />
            Histórico temporal
          </CardTitle>
          <p className="text-sm text-slate-500">
            Alterações de cargo ao longo do tempo
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          {temporalHistory.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4">
              <AlertCircle className="h-5 w-5 text-slate-400" />
              <p className="text-sm text-slate-600">
                Sem histórico de cargos anteriores.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {temporalHistory.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor(
                          item.role,
                        )}`}
                      >
                        {roleLabels[item.role]}
                      </span>
                    </div>

                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {formatDate(item.startDate)} →{" "}
                      {item.endDate ? formatDate(item.endDate) : "Presente"}
                    </p>

                    {item.endJustification && (
                      <p className="text-sm text-slate-600">
                        {item.endJustification}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { ProfileRolesCard };
