import { useNavigate } from "react-router";

import { appPaths } from "../../../app/router/paths";
import { authStore } from "../model/auth.store";
import { logout } from "../api/logout";

function useLogout() {
  const navigate = useNavigate();

  return async () => {
    try {
      await logout();
    } finally {
      authStore.clearSession();
      navigate(appPaths.login, { replace: true });
    }
  };
}

export { useLogout };
