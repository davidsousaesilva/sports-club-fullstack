import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { usePeople } from "../hooks/use-people";
import {
  type PersonActiveFilter,
  type PersonRole,
} from "../model/person.types";
import { PeopleStats } from "../components/people/PeopleStats";
import { PeopleFilters } from "../components/people/PeopleFilters";
import { PeopleGrid } from "../components/people/PeopleGrid";
import { CreatePersonDialog } from "../components/people/CreatePersonDialog";

function PeoplePage() {
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<PersonRole | "ALL">("ALL");
  const [activeFilter, setActiveFilter] = useState<PersonActiveFilter>("ALL");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const peopleQuery = usePeople({
    role: roleFilter,
    active: activeFilter,
    personNameOrEmail: searchValue,
  });

  const stats = useMemo(() => {
    const people = peopleQuery.people;

    const activePeople = people.filter((person) => person.active).length;
    const athleteCount = people.filter((person) =>
      person.activeRoles.some((role) => role.role === "ATHLETE"),
    ).length;
    const coachCount = people.filter((person) =>
      person.activeRoles.some((role) => role.role === "COACH"),
    ).length;
    const staffCount = people.filter((person) =>
      person.activeRoles.some(
        (role) => role.role === "EMPLOYEE" || role.role === "MANAGER",
      ),
    ).length;

    return {
      totalPeople: people.length,
      activePeople,
      athleteCount,
      coachCount,
      staffCount,
    };
  }, [peopleQuery.people]);

  return (
    <>
      <section className="space-y-6">
        <header className="flex justify-between items-center">
          <div className="flex flex-col gap-1 max-w-full">
            <h1 className="text-2xl font-semibold text-slate-950">Pessoas</h1>
            <p className="text-sm text-slate-600">
              Gestão das pessoas do clube.
            </p>
          </div>

          <Button type="button" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar pessoa
          </Button>
        </header>

        <PeopleStats stats={stats} isLoading={peopleQuery.isLoading} />

        <PeopleFilters
          searchValue={searchValue}
          roleFilter={roleFilter}
          activeFilter={activeFilter}
          onSearchChange={setSearchValue}
          onRoleFilterChange={setRoleFilter}
          onActiveFilterChange={setActiveFilter}
        />

        <PeopleGrid
          people={peopleQuery.people}
          isLoading={peopleQuery.isLoading}
        />
      </section>

      <CreatePersonDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}

export { PeoplePage };
