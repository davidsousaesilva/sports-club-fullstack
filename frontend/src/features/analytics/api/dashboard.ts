import { httpClient } from "../../../lib/api/http-client";
import { mapDashboardResponse } from "../model/dashboard/dashboard.mappers";
import type { DashboardResponseDto } from "../model/dashboard/dashboard.types";

async function getDashboard() {
  const response = await httpClient.get<DashboardResponseDto>("api/dashboard");

  return mapDashboardResponse(response);
}

export { getDashboard };
