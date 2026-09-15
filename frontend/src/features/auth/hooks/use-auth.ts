import { useMemo, useSyncExternalStore } from "react";

import { authStore } from "../model/auth.store";

function useAuth() {
  const session = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSession,
    authStore.getSession,
  );

  return useMemo(
    () => ({
      ...session,
      setActiveView: authStore.setActiveView,
      clearSession: authStore.clearSession,
    }),
    [
      session.accessToken,
      session.activeView,
      session.availableViews,
      session.claims,
      session.isAuthenticated,
    ],
  );
}

export { useAuth };
