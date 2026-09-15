import { useQuery } from "@tanstack/react-query";

import { getSportsReport } from "../api/sports-report";

const SPORTS_REPORT_QUERY_KEY = ["analytics", "sports-report"] as const;

function useSportsReport() {
  const query = useQuery({
    queryKey: SPORTS_REPORT_QUERY_KEY,
    queryFn: getSportsReport,
    retry: false,
  });

  return {
    report: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}

export { useSportsReport, SPORTS_REPORT_QUERY_KEY };
