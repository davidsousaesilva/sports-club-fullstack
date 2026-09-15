import { useMemo } from "react";

import { useAuth } from "./use-auth";

type CurrentUser = {
  id: number;
  email: string;
  name: string;
  active: boolean;
};

type UseCurrentUserResult = {
  user: CurrentUser | null;
};

function useCurrentUser(): UseCurrentUserResult {
  const { isAuthenticated, claims } = useAuth();

  const user = useMemo<CurrentUser | null>(() => {
    if (!isAuthenticated || !claims) {
      return null;
    }

    const parsedId = Number(claims.subject);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return null;
    }

    return {
      id: parsedId,
      email: claims.email,
      name: claims.name,
      active: claims.active,
    };
  }, [claims, isAuthenticated]);

  return {
    user,
  };
}

export { useCurrentUser };
