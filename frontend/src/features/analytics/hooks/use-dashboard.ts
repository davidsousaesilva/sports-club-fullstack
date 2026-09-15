import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "../api/dashboard";

const DASHBOARD_QUERY_KEY = ["analytics", "dashboard"];

function useDashboard() {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboard,
    retry: false,
  });

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}

export { useDashboard, DASHBOARD_QUERY_KEY };