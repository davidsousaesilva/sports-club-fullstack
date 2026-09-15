import type { RouteObject } from "react-router";

import { AuthGuard, RoleRouteGuard } from "./route-guards";
import { appPaths } from "./paths";
import { PublicLayout } from "../../layouts/PublicLayout";
import { AuthenticatedLayout } from "../../layouts/AuthenticatedLayout";
import { LandingPage } from "../../features/landing";
import { LoginPage, UnauthorizedPage } from "../../features/auth";
import {
  CalendarPage,
  CompetitionPage,
  EventPage,
  TrainingPage,
} from "../../features/activities";
import { SelfGuidedTrainingPage } from "../../features/activity-tracking";
import {
  DashboardPage,
  SportsReportPage,
  FinanceReportPage,
} from "../../features/analytics";
import { FinancePage } from "../../features/finance";
import {
  PeoplePage,
  ProfilePage,
  NotificationPage,
} from "../../features/identity";
import { TeamsPage } from "../../features/teams";
import { ModalitiesPage, ClubSettingsPage } from "../../features/sportscore";

export const routeConfig: RouteObject[] = [
  {
    path: appPaths.home,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: appPaths.login.slice(1),
        element: <LoginPage />,
      },
      {
        path: appPaths.unauthorized.slice(1),
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: appPaths.app,
        element: <AuthenticatedLayout />,
        children: [
          {
            index: true,
            element: <CalendarPage />,
          },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            element: <RoleRouteGuard allowedRoles={["MANAGER"]} />,
            children: [
              {
                path: "dashboard",
                element: <DashboardPage />,
              },
              {
                path: "sports-report",
                element: <SportsReportPage />,
              },
              {
                path: "finance-report",
                element: <FinanceReportPage />,
              },
            ],
          },
          {
            element: <RoleRouteGuard allowedRoles={["MANAGER", "EMPLOYEE"]} />,
            children: [
              {
                path: "people",
                element: <PeoplePage />,
              },
              {
                path: "people/:personId",
                element: <ProfilePage />,
              },
              {
                path: "modalities",
                element: <ModalitiesPage />,
              },
              {
                path: "club-settings",
                element: <ClubSettingsPage />,
              },
            ],
          },
          {
            element: (
              <RoleRouteGuard
                allowedRoles={["MANAGER", "EMPLOYEE", "ATHLETE"]}
              />
            ),
            children: [
              {
                path: "finance",
                element: <FinancePage />,
              },
            ],
          },
          {
            element: (
              <RoleRouteGuard allowedRoles={["MANAGER", "COACH", "ATHLETE"]} />
            ),
            children: [
              {
                path: "training",
                element: <TrainingPage />,
              },
              {
                path: "competition",
                element: <CompetitionPage />,
              },
              {
                path: "event",
                element: <EventPage />,
              },
            ],
          },
          {
            element: <RoleRouteGuard allowedRoles={["MANAGER", "EMPLOYEE"]} />,
            children: [
              {
                path: "self-guided-training",
                element: <SelfGuidedTrainingPage />,
              },
            ],
          },
          {
            element: (
              <RoleRouteGuard
                allowedRoles={["MANAGER", "EMPLOYEE", "COACH", "ATHLETE"]}
              />
            ),
            children: [
              {
                path: "teams",
                element: <TeamsPage />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
            ],
          },
          {
            element: <RoleRouteGuard allowedRoles={["ATHLETE"]} />,
            children: [
              {
                path: "notification",
                element: <NotificationPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
