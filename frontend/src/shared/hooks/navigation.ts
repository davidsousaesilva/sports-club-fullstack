import { appPaths } from "../../app/router/paths";
import type { Role } from "../../lib/constants/roles";

const navigationIconKeys = [
  "calendar",
  "clubSettings",
  "dashboard",
  "sportsReport",
  "financeReport",
  "notification",
  "people",
  "modalities",
  "teams",
  "training",
  "selfGuidedTraining",
  "competition",
  "event",
  "finance",
  "profile",
] as const;

type NavigationIconKey = (typeof navigationIconKeys)[number];

type NavigationSection = {
  label: string;
  path: string;
  roles: Role[];
  iconKey: NavigationIconKey;
};

type NavigationItem = NavigationSection;

const navigationSections = [
  {
    label: "Calendário",
    path: appPaths.calendar,
    roles: ["MANAGER", "EMPLOYEE", "COACH", "ATHLETE"],
    iconKey: "calendar",
  },
  {
    label: "Configurações",
    path: appPaths.clubSettings,
    roles: ["MANAGER", "EMPLOYEE"],
    iconKey: "clubSettings",
  },
  {
    label: "Dashboard",
    path: appPaths.dashboard,
    roles: ["MANAGER"],
    iconKey: "dashboard",
  },
  {
    label: "Rel. Desportivo",
    path: appPaths.sportsReport,
    roles: ["MANAGER"],
    iconKey: "sportsReport",
  },
  {
    label: "Rel. Financeiro",
    path: appPaths.financeReport,
    roles: ["MANAGER"],
    iconKey: "financeReport",
  },

  {
    label: "Notificações",
    path: appPaths.notification,
    roles: ["ATHLETE"],
    iconKey: "notification",
  },
  {
    label: "Pessoas",
    path: appPaths.people,
    roles: ["MANAGER", "EMPLOYEE"],
    iconKey: "people",
  },
  {
    label: "Modalidades",
    path: appPaths.modalities,
    roles: ["MANAGER", "EMPLOYEE"],
    iconKey: "modalities",
  },
  {
    label: "Equipas",
    path: appPaths.teams,
    roles: ["MANAGER", "EMPLOYEE", "COACH", "ATHLETE"],
    iconKey: "teams",
  },
  {
    label: "Treinos",
    path: appPaths.training,
    roles: ["MANAGER", "COACH", "ATHLETE"],
    iconKey: "training",
  },
  {
    label: "Treinos Livres",
    path: appPaths.selfGuidedTraining,
    roles: ["MANAGER", "EMPLOYEE"],
    iconKey: "selfGuidedTraining",
  },
  {
    label: "Competições",
    path: appPaths.competition,
    roles: ["MANAGER", "COACH", "ATHLETE"],
    iconKey: "competition",
  },
  {
    label: "Eventos",
    path: appPaths.event,
    roles: ["MANAGER", "COACH", "ATHLETE"],
    iconKey: "event",
  },
  {
    label: "Finanças",
    path: appPaths.finance,
    roles: ["MANAGER", "EMPLOYEE", "ATHLETE"],
    iconKey: "finance",
  },
] satisfies NavigationSection[];

export { navigationIconKeys, navigationSections };
export type { NavigationIconKey, NavigationItem, NavigationSection };
