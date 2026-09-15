import { httpClient } from "../../../lib/api/http-client";
import { mapFinancialReportResponse } from "../model/financial-report/financial-report.mappers";
import type { FinancialReportResponseDto } from "../model/financial-report/financial-report.types";

async function getFinancialReport() {
  const response = await httpClient.get<FinancialReportResponseDto>(
    "api/reports/financial",
  );

  return mapFinancialReportResponse(response);
}

export { getFinancialReport };
