import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createComplex,
  deleteComplex as deleteComplexRequest,
  listComplexes,
  updateComplex,
} from "../api/club-settings";
import {
  mapCreateComplexRequest,
  mapUpdateComplexRequest,
} from "../model/club-settings.mappers";
import type {
  ClubComplex,
  ComplexFormValues,
} from "../model/club-settings.types";

const COMPLEXES_QUERY_KEY = ["sportscore", "club-settings", "complexes"];

function useComplexes() {
  const queryClient = useQueryClient();

  const complexesQuery = useQuery({
    queryKey: COMPLEXES_QUERY_KEY,
    queryFn: listComplexes,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (values: ComplexFormValues) => {
      return createComplex(mapCreateComplexRequest(values));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLEXES_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      complex,
      values,
    }: {
      complex: ClubComplex;
      values: ComplexFormValues;
    }) => {
      return updateComplex(
        complex.id,
        mapUpdateComplexRequest(values, complex.version),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLEXES_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComplexRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLEXES_QUERY_KEY });
    },
  });

  return {
    complexes: complexesQuery.data ?? [],
    isLoading: complexesQuery.isLoading,
    isFetching: complexesQuery.isFetching,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createComplex: createMutation.mutateAsync,
    updateComplex: updateMutation.mutateAsync,
    deleteComplex: deleteMutation.mutateAsync,
  };
}

export { useComplexes, COMPLEXES_QUERY_KEY };