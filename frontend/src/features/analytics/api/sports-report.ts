import { httpClient } from "../../../lib/api/http-client";
import { mapSportReportResponse } from "../model/sports-report/sports-report.mappers";
import type { SportReportResponseDto } from "../model/sports-report/sports-report.types";

async function getSportsReport() {
  const response =
    await httpClient.get<SportReportResponseDto>("api/reports/sport");

  return mapSportReportResponse(response);
}

export { getSportsReport };
