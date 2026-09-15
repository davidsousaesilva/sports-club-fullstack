import { CalendarDays, Eye, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../../shared/components/ui/button/Button";
import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import { roleBadgeClasses, roleLabels } from "../../../../lib/constants/roles";
import type { Person } from "../../model/person.types";

interface PersonCardProps {
  person: Person;
}

function formatDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("pt-PT");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function PersonCard({ person }: PersonCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-black/90 to-blue-900 text-lg font-semibold text-white">
            {getInitials(person.name)}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <h2 className="truncate text-lg font-semibold text-slate-950">
                      {person.name}
                    </h2>

                    {person.active ? (
                      <span className="inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex w-fit rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                        Inativo
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {person.activeRoles.length > 0 ? (
                      person.activeRoles.map((role) => (
                        <span
                          key={role.id}
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${roleBadgeClasses[role.role]}`}
                        >
                          {roleLabels[role.role]}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Sem papel ativo
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/app/people/${person.id}`)}
                  aria-label={`Ver perfil de ${person.name}`}
                  className="shrink-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{person.email}</span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{person.phone || "-"}</span>
              </p>

              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                <span>Data de nascimento: {formatDate(person.birthDate)}</span>
              </p>

              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                <span>Data de entrada: {formatDate(person.entryDate)}</span>
              </p>

              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>{person.address || "-"}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { PersonCard };
