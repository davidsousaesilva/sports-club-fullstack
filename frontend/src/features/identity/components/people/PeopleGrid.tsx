import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import type { Person } from "../../model/person.types";
import { PersonCard } from "./PersonCard";

interface PeopleGridProps {
  people: Person[];
  isLoading?: boolean;
  isError?: boolean;
}

function PeopleGrid({
  people,
  isLoading = false,
  isError = false,
}: PeopleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-44 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50 shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-red-700">
            Não foi possível carregar as pessoas neste momento.
          </p>
          <p className="mt-1 text-sm text-red-600">
            Tenta novamente dentro de instantes.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (people.length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            Nenhuma pessoa encontrada.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Ajusta os filtros atuais ou cria uma nova pessoa.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}

export { PeopleGrid };
