import { useQuery } from "@tanstack/react-query";

import { getFinancialReport } from "../api/financial-report";

const FINANCIAL_REPORT_QUERY_KEY = ["analytics", "financial-report"] as const;

function useFinancialReport() {
  const query = useQuery({
    queryKey: FINANCIAL_REPORT_QUERY_KEY,
    queryFn: getFinancialReport,
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

export { useFinancialReport, FINANCIAL_REPORT_QUERY_KEY };
