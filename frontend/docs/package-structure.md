```text
frontend/
│
├── docs/
│   └── package-structure.md
│
├── public/
│   │   ├── club-mark.png
│   │   └── hero-banner.png
│
├── src/
│   ├── app/
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx
│   │   │   ├── RouterProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── router/
│   │   │   ├── index.tsx
│   │   │   ├── route-guards.tsx
│   │   │   ├── route-config.tsx
│   │   │   └── paths.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── api.ts
│   │   └── auth.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── http-client.ts
│   │   │   ├── api-error.ts
│   │   │   └── query-client.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── token-storage.ts
│   │   │   ├── auth-session.ts
│   │   │   └── permission-resolver.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │
│   │   └── constants/
│   │       ├── roles.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button/
│   │   │   │   │   └── Button.tsx
│   │   │   │   ├── card/
│   │   │   │   │   └── Card.tsx
│   │   │   │   ├── input/
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   └── Label.tsx
│   │   │   │   ├── dialog/
│   │   │   │   │   ├── Dialog.tsx
│   │   │   │   │   ├── AlertDialog.tsx
│   │   │   │   │   └── DeleteConfirmationDialog.tsx
│   │   │   │   ├── select/
│   │   │   │   │   ├── Select.tsx
│   │   │   │   ├── checkbox/
│   │   │   │   ├── textarea/
│   │   │   │   │   ├── Textarea.tsx
│   │   │   │   └── index.ts
│   │   │   ├── filters/
│   │   │   │   ├── FiltersBar.tsx
│   │   │   │   ├── FilterSelect.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   ├── data-display/
│   │   │       ├── stats-card
│   │   │           ├── index.ts
│   │   │           ├── StatCard.tsx
│   │   │           ├── StatsGrid.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── navigation.ts
│   │   │
│   │   ├── shell/
│   │   │   ├── AccountMenu.tsx
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppNavigation.tsx
│   │   │   ├── AppSideBar.tsx
│   │   │   └── index.ts
│   │   │
│   │   |
│   │   │
│   │   └── styles/
│   │       ├── globals.css
│   │       └── tailwind.css
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   ├── login.ts
│   │   │   │   ├── refresh-token.ts
│   │   │   │   ├── logout.ts
│   │   │   │   └── mappers.ts
│   │   │   ├── components/
│   │   │   │   ├── login-form/
│   │   │   │   ├── protected-route/
│   │   │   │   │   └── ProtectedRoute.tsx
│   │   │   │   ├── role-guard/
│   │   │   │   │   └── RoleGuard.tsx
│   │   │   │   └── session-expired-dialog/
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.ts
│   │   │   │   ├── use-current-user.ts
│   │   │   │   ├── use-login.ts
│   │   │   │   ├── use-logout.ts
│   │   │   │   └── use-permissions.ts
│   │   │   ├── model/
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── auth.store.ts
│   │   │   │   └── auth.selectors.ts
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── UnauthorizedPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── landing/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   └── LandingPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── identity/
│   │   │   ├── api/
│   │   │   │   ├── people.ts
│   │   │   │   ├── notifications.ts
│   │   │   ├── components/
│   │   │   │   ├── people/
│   │   │   │   │   ├── CreatePersonDialog.tsx
│   │   │   │   │   ├── PeopleFilters.tsx
│   │   │   │   │   ├── PeopleGrid.tsx
│   │   │   │   │   ├── PeopleStats.tsx
│   │   │   │   │   ├── PersonCard.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   ├── AssignRoleDialog.tsx
│   │   │   │   │   ├── ProfileDetailsForm.tsx
│   │   │   │   │   ├── ProfileRolesCard.tsx
│   │   │   │   │   ├── ProfileSecurityCard.tsx
│   │   │   │   │   ├── ProfileStatisticsTab.tsx
│   │   │   │   │   ├── TerminateRoleDialog.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-people.ts
│   │   │   │   ├── use-profile.ts
│   │   │   │   ├── use-notification.ts
│   │   │   ├── model/
│   │   │   │   ├── notification.mocks.ts
│   │   │   │   ├── notification.types.ts
│   │   │   │   ├── people.mocks.ts
│   │   │   │   ├── person.mappers.ts
│   │   │   │   ├── person.types.ts
│   │   │   ├── pages/
│   │   │   │   ├── PeoplePage.tsx
│   │   │   │   ├── NotificationPage.tsx
│   │   │   │   └── ProfilePage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── sportscore/
│   │   │   ├── api/
│   │   │   │   │── club-settings.ts
│   │   │   │   └── modalities.ts
│   │   │   ├── components/
│   │   │   │   │── club-settings/
│   │   │   │   │   ├── ComplexesSection.tsx
│   │   │   │   │   ├── ComplexFormDialog.tsx
│   │   │   │   │   ├── StatisticTypeFormDialog.tsx
│   │   │   │   │   └── StatisticTypesSection.tsx
│   │   │   │   └── modalities/
│   │   │   │       ├── ModalitiesFilters.tsx
│   │   │   │       ├── ModalitiesStats.tsx
│   │   │   │       ├── ModalityCard.tsx
│   │   │   │       └── ModalityFormDialog.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-complexes.ts
│   │   │   │   │── use-statistic-types.ts
│   │   │   │   └── use-modalities.ts
│   │   │   ├── model/
│   │   │   │   ├── club-settings.mappers.ts
│   │   │   │   │── club-settings.types.ts
│   │   │   │   │── club-settings.mocks.ts
│   │   │   │   ├── modalities.mappers.ts
│   │   │   │   ├── modalities.types.ts
│   │   │   │   └── modalities.mocks.ts
│   │   │   ├── pages/
│   │   │   │   ├── ModalitiesPage.tsx
│   │   │   │   └── ClubSettingsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── teams/
│   │   │   ├── api/
│   │   │   │   ├── teams.ts
│   │   │   ├── components/
│   │   │   │   ├── TeamCard.tsx
│   │   │   │   ├── TeamDetailsDialog.tsx
│   │   │   │   ├── TeamFilters.tsx
│   │   │   │   ├── TeamFormDialog.tsx
│   │   │   │   ├── TeamMembersManager.tsx
│   │   │   │   ├── TeamMembersSection.tsx
│   │   │   │   ├── TeamStats.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-teams.ts
│   │   │   ├── model/
│   │   │   │   ├── team.mappers
│   │   │   │   ├── team.mocks.ts
│   │   │   │   ├── team.types.ts
│   │   │   ├── pages/
│   │   │   │   └── TeamsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── activities/
│   │   │   ├── api/
│   │   │   │   ├── calendar.ts
│   │   │   │   ├── competitions.ts
│   │   │   │   ├── events.ts
│   │   │   │   ├── training.ts
│   │   │   ├── components/
│   │   │   │   ├── calendar/
│   │   │   │   │   ├── CalendarDayDetailsDialog.tsx
│   │   │   │   │   ├── CalendarGrid.tsx
│   │   │   │   │   ├── CalendarScopeSummary.tsx
│   │   │   │   ├── competition/
│   │   │   │   │   ├── CompetitionCard.tsx
│   │   │   │   │   ├── CompetitionDetailsDialog.tsx
│   │   │   │   │   ├── CompetitionFilters.tsx
│   │   │   │   │   ├── CompetitionFormDialog.tsx
│   │   │   │   │   ├── CompetitionStats.tsx
│   │   │   │   │   ├── CompetitionTeamsManagerDialog.tsx
│   │   │   │   ├── event/
│   │   │   │   │   ├── EventCard.tsx
│   │   │   │   │   ├── EventDetailsDialog.tsx
│   │   │   │   │   ├── EventFilters.tsx
│   │   │   │   │   ├── EventFormDialog.tsx
│   │   │   │   │   ├── EventStats.tsx
│   │   │   │   │   ├── EventTeamsManagerDialog.tsx
│   │   │   │   ├── training/
│   │   │   │   │   ├── DeleteTrainingDialog.tsx
│   │   │   │   │   ├── TrainingCard.tsx
│   │   │   │   │   ├── TrainingFilters.tsx
│   │   │   │   │   ├── TrainingFormDialog.tsx
│   │   │   │   │   ├── TrainingStats.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-calendar.ts
│   │   │   │   ├── use-competitions.ts
│   │   │   │   ├── use-events.ts
│   │   │   │   ├── use-training.ts
│   │   │   ├── model/
│   │   │   │   ├── calendar/
│   │   │   │   │   ├── calendar.mappers.ts
│   │   │   │   │   ├── calendar.mocks.ts
│   │   │   │   │   ├── calendar.types.ts
│   │   │   │   ├── competition/
│   │   │   │   │   ├── competition.mappers.ts
│   │   │   │   │   ├── competition.mocks.ts
│   │   │   │   │   ├── competition.types.ts
│   │   │   │   ├── event/
│   │   │   │   │   ├── event.mappers.ts
│   │   │   │   │   ├── event.mocks.ts
│   │   │   │   │   ├── event.types.ts
│   │   │   │   ├── training/
│   │   │   │   │   ├── training.mappers.ts
│   │   │   │   │   ├── training.mocks.ts
│   │   │   │   │   ├── training.types.ts
│   │   │   ├── pages/
│   │   │   │   ├── CalendarPage.tsx
│   │   │   │   ├── CompetitionPage.tsx
│   │   │   │   ├── EventPage.tsx
│   │   │   │   ├── TrainingPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── activity-tracking/
│   │   │   ├── api/
│   │   │   │   ├── activity-records.ts
│   │   │   │   ├── free-trainings.ts
│   │   │   ├── components/
│   │   │   │   ├── AttendanceDialog.tsx
│   │   │   │   ├── PerformanceDialog.tsx
│   │   │   │   ├── selfGuidedTraining/
│   │   │   │   │   ├── AthleteAttendanceList.tsx
│   │   │   │   │   ├── SelfGuidedTrainingFilters.tsx
│   │   │   │   │   ├── SelfGuidedTrainingStats.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-event-activity-records.ts
│   │   │   │   ├── use-free-training.ts
│   │   │   │   ├── use-training-activity-records.ts
│   │   │   ├── model/
│   │   │   │   ├── activity-records.mappers.ts
│   │   │   │   ├── activity-records.types.ts
│   │   │   │   ├── free-trainings.mocks.ts
│   │   │   ├── pages/
│   │   │   │   └── SelfGuidedTrainingPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── finance/
│   │   │   ├── api/
│   │   │   │   ├── finance.ts
│   │   │   ├── components/
│   │   │   │   ├── FinanceFeeActionDialogs.tsx
│   │   │   │   ├── FinanceFeeCard.tsx
│   │   │   │   ├── FinanceFeeFilters.tsx
│   │   │   │   ├── FinanceFeePaymentDetailsDialog.tsx
│   │   │   │   ├── FinanceFeesSection.tsx
│   │   │   │   ├── FinanceFormsSection.tsx
│   │   │   │   ├── FinanceOnlinePaymentDialog.tsx
│   │   │   │   ├── FinancePageContent.tsx
│   │   │   │   ├── FinancePaymentCard.tsx
│   │   │   │   ├── FinancePaymentEditDialog.tsx
│   │   │   │   ├── FinancePaymentFeeDetailsDialog.tsx
│   │   │   │   ├── FinancePaymentPaymentsSection.tsx
│   │   │   │   ├── FinancePaymentStatsGrid.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-finance.ts
│   │   │   ├── model/
│   │   │   │   ├── finance.mappers.ts
│   │   │   │   ├── finance.mocks.ts
│   │   │   │   ├── finance.types.ts
│   │   │   ├── pages/
│   │   │   │   └── FinancePage.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── analytics/
│   │       ├── api/
│   │       │   ├── dashboard.ts
│   │       │   ├── financial-report.ts
│   │       │   ├── sports-report.ts
│   │       ├── components/
│   │       │   ├── dashboard/
│   │       │   │   ├── DashboardStatCard.tsx
│   │       │   │   ├── DashboardStatsGrid.tsx
│   │       │   │   ├── FinancialSnapshotChart.tsx
│   │       │   │   ├── ModalityTeamsChart.tsx
│   │       │   │   ├── DebtFeesCard.tsx
│   │       │   │   ├── UpcomingActivitiesCard.tsx
│   │       │   ├── financial-report/
│   │       │   │   ├── FeeAnalysisChard.tsx
│   │       │   │   ├── FeeStatusChart.tsx
│   │       │   │   ├── FinancelReportStatCard.tsx
│   │       │   │   ├── FinanceReportStatsGrid.tsx
│   │       │   │   ├── FinancialAnalysisChart.tsx
│   │       │   │   ├── PaymentMethodsCard.tsx
│   │       │   │   ├── ProfitTrendChart.tsx
│   │       │   │   ├── RevenuesBySourceCard.tsx
│   │       │   ├── sports-report/
│   │       │   │   ├── AveragePerformanceByModalityChart.tsx
│   │       │   │   ├── CompetitionAwardsChart.tsx
│   │       │   │   ├── ModalityAthletesDistributionChart.tsx
│   │       │   │   ├── MultidimensionalPerformanceChart.tsx
│   │       │   │   ├── SportsReportStatChart.tsx
│   │       │   │   ├── SportsReportStatsGrid.tsx
│   │       │   │   ├── TeamAttendanceRateChart.tsx
│   │       │   │   ├── TrainingAttendanceEvolutionChart.tsx
│   │       ├── hooks/
│   │       │   ├── use-dashboard.ts
│   │       │   ├── use-financial-report.ts
│   │       │   ├── use-sports-report.ts
│   │       ├── model/
│   │       │   ├── dashboard/
│   │       │   │   ├── dashboard.mappers.ts
│   │       │   │   ├── dashboard.mocks.ts
│   │       │   │   ├── dashboard.types.ts
│   │       │   ├── financial-report/
│   │       │   │   ├── financial-report.mappers.ts
│   │       │   │   ├── financial-report.mocks.ts
│   │       │   │   ├── financial-report.types.ts
│   │       │   ├── sports-report/
│   │       │   │   ├── sports-report.mappers.ts
│   │       │   │   ├── sports-report.mocks.ts
│   │       │   │   ├── sports-report.types.ts
│   │       ├── pages/
│   │       │   ├── DashboardPage.tsx
│   │       │   │── FinanceReportPage.tsx
│   │       │   ├── SportsReportPage.tsx
│   │       └── index.ts
│   │
│   ├── layouts/
│       ├── AuthenticatedLayout.tsx
│       └── PublicLayout.tsx
│
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```
