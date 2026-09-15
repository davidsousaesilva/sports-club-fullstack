import { authConfig } from "../../../config/auth";
import { httpClient } from "../../../lib/api/http-client";

async function logout(): Promise<void> {
  if (authConfig.mode === "mock") {
    return;
  }

  await httpClient.post<void>(authConfig.endpoints.logout);
}

export { logout };
