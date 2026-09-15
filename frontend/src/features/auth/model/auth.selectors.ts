import { authStore } from "./auth.store";

function selectAuthSession() {
  return authStore.getSession();
}

function selectAvailableViews() {
  return authStore.getSession().availableViews;
}

function selectActiveView() {
  return authStore.getSession().activeView;
}

function selectIsAuthenticated() {
  return authStore.getSession().isAuthenticated;
}

export {
  selectActiveView,
  selectAuthSession,
  selectAvailableViews,
  selectIsAuthenticated,
};
