import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPerson, listPeople } from "../api/people";
import type {
  CreatePersonFormValues,
  PersonFilterValues,
  PersonRole,
} from "../model/person.types";

const PEOPLE_QUERY_KEY = ["identity", "people"] as const;

function normalizeFilters(filters: PersonFilterValues): PersonFilterValues {
  return {
    role: filters.role,
    active: filters.active,
    personNameOrEmail: filters.personNameOrEmail.trim(),
  };
}

function usePeople(filters: PersonFilterValues) {
  const normalizedFilters = useMemo(() => normalizeFilters(filters), [filters]);

  const query = useQuery({
    queryKey: [...PEOPLE_QUERY_KEY, normalizedFilters],
    queryFn: () => listPeople(normalizedFilters),
  });

  return {
    people: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    isUsingMocks: false,
  };
}

function useCreatePerson() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CreatePersonFormValues) => createPerson(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PEOPLE_QUERY_KEY,
      });
    },
  });

  return {
    createPerson: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

const PERSON_ROLE_OPTIONS: PersonRole[] = [
  "MANAGER",
  "EMPLOYEE",
  "COACH",
  "ATHLETE",
];

export { usePeople, useCreatePerson, PEOPLE_QUERY_KEY, PERSON_ROLE_OPTIONS };