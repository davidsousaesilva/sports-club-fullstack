# Package Structure

A estrutura do projeto está organizada sob o package raiz `com.sportsclub`, combinando componentes transversais com módulos funcionais independentes.

## Root package

```text
com.sportsclub
```

## Estrutura completa

```text
clube-desportivo/
├── docs/
│   └── package-structure.md
├── Dockerfile
├── pom.xml
├── README.md
├── target/
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── sportsclub/
        │           ├── ClubeDesportivoApplication.java
        │
        │           ├── bootstrap/
        │           │   ├── DataInitializer.java
        |
        │           ├── config/
        │           │   ├── CorsConfig.java
        │           │   └── OpenApiConfig.java
        │
        │           ├── security/
        │           │   ├── config/
        │           │   │   └── SecurityConfig.java
        │           │   ├── controller/
        │           │   │   └── AuthenticationController.java
        │           │   ├── dto/
        │           │   │   ├── request/
        │           │   │   └── response/
        │           │   ├── handler/
        │           │   │   └── CustomSecurityHandlers.java
        │           │   ├── jwt/
        │           │   │   ├── JwtAuthenticationFilter.java
        │           │   │   ├── JwtService.java
        │           │   │   └── TokenBlacklistService.java
        │           │   ├── user/
        │           │   │   ├── AuthenticatedUser.java
        │           │   │   └── PersonUserDetailsService.java
        │           │   └── util/
        │           │       └── SecurityUtils.java
        │
        │           ├── shared/
        │           │   ├── controller/
        │           │   │   └── GlobalExceptionHandler.java
        │           │   └── domain/
        │           │       ├── entities/
        │           │       │   ├── AuditableEntity.java
        │           │       │   └── PersonAuditableEntity.java
        │
        │     (ss1) ├── identity/
        │           │   ├── application/
        │           │   │   ├── PersonAuthorizationService.java
        │           │   │   ├── SS1Facade.java
        │           │   │   └── SS1FacadeImpl.java
        │           │   ├── controller/
        │           │   │   └── SS1Controller.java
        │           │   ├── domain/
        │           │   │   ├── entities/
        │           │   │   │   ├── Person.java
        │           │   │   │   └── PersonRole.java
        │           │   │   ├── valueobjects/
        │           │   │   │   └── PersonData.java
        │           │   │   └── enums/
        │           │   │       ├── Gender.java
        │           │   │       ├── Role.java
        │           │   │       └── NotificationType.java
        │           │   ├── dto/
        │           │   │   ├── filter/
        │           │   │   │   └── PersonFilter.java
        │           │   │   ├── request/
        │           │   │   │   ├── AlterPasswordRequest.java
        │           │   │   │   ├── AssignRoleRequest.java
        │           │   │   │   ├── CreatePersonRequest.java
        │           │   │   │   ├── SetPasswordByStaffRequest.java
        │           │   │   │   ├── TerminateRoleRequest.java
        │           │   │   │   └── UpdatePersonRequest.java
        │           │   │   └── response/
        │           │   │       ├── AlterPasswordResponse.java
        │           │   │       ├── BooleanResponse.java
        │           │   │       ├── NotificationResponse.java
        │           │   │       ├── PersonResponse.java
        │           │   │       └── PersonRoleResponse.java
        │           │   ├── repository/
        │           │   │   ├── NotificationRepository.java
        │           │   │   ├── PersonRepository.java
        │           │   │   ├── PersonRoleRepository.java
        │           │   │   └── PersonSpecifications.java
        │           │   └── service/
        │           │       ├── NotificationService.java
        │           │       ├── SS1FactoryService.java
        │           │       └── SS1Mapper.java
        │
        │     (ss2) ├── sportscore/
        │           │   ├── application/
        │           │   │   ├── SS2Facade.java
        │           │   │   └── SS2FacadeImpl.java
        │           │   ├── controller/
        │           │   │   └── SS2Controller.java
        │           │   ├── domain/
        │           │   │   ├── entities/
        │           │   │   │   ├── Modality.java
        │           │   │   │   ├── ModalityPrice.java
        │           │   │   │   ├── ModalityStatisticType.java
        │           │   │   │   ├── ModalityStatisticTypeId.java
        │           │   │   │   ├── SportsComplex.java
        │           │   │   │   └── StatisticType.java
        │           │   │   ├── valueobjects/
        │           │   │   │   ├── ModalityData.java
        │           │   │   │   ├── SportsComplexData.java
        │           │   │   │   └── StatisticTypeData.java
        │           │   ├── dto/
        │           │   │   ├── filter/
        │           │   │   │   └── ModalityFilter.java
        │           │   │   ├── request/
        │           │   │   │   ├── CreateComplexRequest.java
        │           │   │   │   ├── CreateModalityRequest.java
        │           │   │   │   ├── CreateStatisticTypeRequest.java
        │           │   │   │   ├── ModalityPriceRequest.java
        │           │   │   │   ├── StatisticTypeIdRequest.java
        │           │   │   │   ├── UpdateComplexRequest.java
        │           │   │   │   ├── UpdateModalityRequest.java
        │           │   │   │   └── UpdateStatisticTypeRequest.java
        │           │   │   └── response/
        │           │   │       ├── CalculatedPriceResponse.java
        │           │   │       ├── ComplexResponse.java
        │           │   │       ├── ModalityPriceResponse.java
        │           │   │       ├── ModalityResponse.java
        │           │   │       ├── ModalitySummaryResponse.java
        │           │   │       └── StatisticTypeResponse.java
        │           │   ├── repository/
        │           │   │   ├── ModalityPriceRepository.java
        │           │   │   ├── ModalityRepository.java
        │           │   │   ├── ModalitySpecifications.java
        │           │   │   ├── ModalityStatisticTypeRepository.java
        │           │   │   ├── SportsComplexRepository.java
        │           │   │   └── StatisticTypeRepository.java
        │           │   └── service/
        │           │       ├── SS2FactoryService.java
        │           │       ├── SS2Mapper.java
        │           │       ├── SS2ReferenceResolverService.java
        │           │       └── SS2RulesService.java
        │
        │     (ss3) ├── teams/
        │           │   ├── application/
        │           │   │   ├── SS3AuthorizationService.java
        │           │   │   ├── SS3Facade.java
        │           │   │   └── SS3FacadeImpl.java
        │           │   ├── controller/
        │           │   │   └── SS3Controller.java
        │           │   ├── domain/
        │           │   │   ├── entities/
        │           │   │   │   ├── Team.java
        │           │   │   │   └── TeamMember.java
        │           │   │   ├── valueobjects/
        │           │   │   │   └── TeamData.java
        │           │   │   └── enums/
        │           │   │       ├── TeamRelation.java
        │           │   │       └── TeamType.java
        │           │   ├── dto/
        │           │   │   ├── filter/
        │           │   │   │   └── TeamFilter.java
        │           │   │   ├── request/
        │           │   │   │   ├── AddTeamMemberRequest.java
        │           │   │   │   ├── CreateTeamRequest.java
        │           │   │   │   ├── EndMembershipRequest.java
        │           │   │   │   └── UpdateTeamRequest.java
        │           │   │   └── response/
        │           │   │       ├── TeamMemberResponse.java
        │           │   │       ├── TeamResponse.java
        │           │   │       └── TeamSummaryResponse.java
        │           │   ├── repository/
        │           │   │   ├── TeamMemberRepository.java
        │           │   │   └── TeamRepository.java
        │           │   └── service/
        │           │       ├── SS3Mapper.java
        │           │       └── TeamRulesService.java
        │
        │     (ss4) ├── activities/
        │           │   ├── application/
        │           │   │   ├── SS4AuthorizationService.java
        │           │   │   ├── SS4Facade.java
        │           │   │   └── SS4FacadeImpl.java
        │           │   ├── controller/
        │           │   │   └── SS4Controller.java
        │           │   ├── domain/
        │           │   │   ├── entities/
        │           │   │   │   ├── Competition.java
        │           │   │   │   ├── CompetitionTeam.java
        │           │   │   │   ├── Event.java
        │           │   │   │   ├── EventTeam.java
        │           │   │   │   └── Training.java
        │           │   │   ├── valueobjects/
        │           │   │   │   ├── CompetitionData.java
        │           │   │   │   ├── EventData.java
        │           │   │   │   └── TrainingData.java
        │           │   │   └── enums/
        │           │   │       ├── TrainingOrEvent.java
        │           │   │       └── TemporalStatus.java
        │           │   ├── dto/
        │           │   │   ├── filter/
        │           │   │   │   ├── CompetitionFilter.java
        │           │   │   │   ├── EventFilter.java
        │           │   │   │   └── TrainingFilter.java
        │           │   │   ├── request/
        │           │   │   │   ├── CreateCompetitionRequest.java
        │           │   │   │   ├── CreateEventRequest.java
        │           │   │   │   ├── CreateTrainingRequest.java
        │           │   │   │   ├── EnrollTeamRequest.java
        │           │   │   │   ├── UpdateCompetitionRequest.java
        │           │   │   │   ├── UpdateCompetitionTeamRequest.java
        │           │   │   │   ├── UpdateEventRequest.java
        │           │   │   │   ├── UpdateEventTeamRequest.java
        │           │   │   │   └── UpdateTrainingRequest.java
        │           │   │   └── response/
        │           │   │       ├── CompetitionResponse.java
        │           │   │       ├── CompetitionSummaryResponse.java
        │           │   │       ├── CompetitionTeamResponse.java
        │           │   │       ├── EventResponse.java
        │           │   │       ├── EventSummaryResponse.java
        │           │   │       ├── EventTeamResponse.java
        │           │   │       ├── RegistrationFeeResponse.java
        │           │   │       ├── TrainingResponse.java
        │           │   │       └── TrainingSummaryResponse.java
        │           │   ├── repository/
        │           │   │   ├── CompetitionRepository.java
        │           │   │   ├── CompetitionSpecifications.java
        │           │   │   ├── CompetitionTeamRepository.java
        │           │   │   ├── EventRepository.java
        │           │   │   ├── EventSpecifications.java
        │           │   │   ├── EventTeamRepository.java
        │           │   │   ├── TrainingRepository.java
        │           │   │   └── TrainingSpecifications.java
        │           │   └── service/
        │           │       ├── CompetitionRulesService.java
        │           │       ├── SS4FactoryService.java
        │           │       └── SS4Mapper.java
        │
        │     (ss5) ├── activitytracking/
        │           │   ├── application/
        │           │   │   ├── SS5AuthorizationService.java
        │           │   │   ├── SS5Facade.java
        │           │   │   └── SS5FacadeImpl.java
        │           │   ├── controller/
        │           │   │   └── SS5Controller.java
        │           │   ├── domain/
        │           │   │   ├── entities/
        │           │   │   │   ├── Attendance.java
        │           │   │   │   └── Performance.java
        │           │   │   ├── valueobjects/
        │           │   │   │   ├── AttendanceData.java
        │           │   │   │   └── PerformanceData.java
        │           │   ├── dto/
        │           │   │   ├── request/
        │           │   │   │   ├── PerformanceItemRequest.java
        │           │   │   │   ├── RegisterOrUpdateAttendanceRequest.java
        │           │   │   │   └── RegisterOrUpdatePerformanceRequest.java
        │           │   │   └── response/
        │           │   │       ├── AggregatedPerformanceResponse.java
        │           │   │       ├── AttendanceResponse.java
        │           │   │       ├── AttendanceStatisticsResponse.java
        │           │   │       ├── PerformanceResponse.java
        │           │   │       └── RecentAttendanceResponse.java
        │           │   ├── repository/
        │           │   │   ├── AttendanceRepository.java
        │           │   │   └── PerformanceRepository.java
        │           │   └── service/
        │           │       ├── AttendanceRulesService.java
        │           │       ├── AttendanceStatisticsService.java
        │           │       ├── PerformanceAggregationService.java
        │           │       ├── PerformanceRulesService.java
        │           │       └── SS5Mapper.java
        │
        │     (ss6) ├── finance/
        │           │   ├── application/
        │           │   │   ├── SS6AuthorizationService.java
        │           │   │   ├── SS6Facade.java
        │           │   │   └── SS6FacadeImpl.java
        │           │   ├── controller/
        │           │   │   ├── SS6Controller.java
        │           │   │   └── SS6GatewayController.java
        │           │   ├── domain/
        │           │   │   ├── entities/
        │           │   │   │   ├── Fee.java
        │           │   │   │   ├── Payment.java
        │           │   │   │   ├── GatewayNotification.java
        │           │   │   │   └── GatewayPaymentAttempt.java
        │           │   │   ├── valueobjects/
        │           │   │   │   └── FeeData.java
        │           │   │   └── enums/
        │           │   │       ├── FeeStatus.java
        │           │   │       ├── FeeType.java
        │           │   │       ├── PaymentStatus.java
        │           │   │       ├── PaymentMethod.java
        │           │   │       ├── PaymentChannel.java
        │           │   │       └── ExternalPaymentStatus.java
        │           │   ├── dto/
        │           │   │   ├── filter/
        │           │   │   │   └── FeeFilterQuery.java
        │           │   │   ├── request/
        │           │   │   │   ├── GatewayNotificationRequest.java
        │           │   │   │   ├── RegisterCashPaymentRequest.java
        │           │   │   │   ├── RegisterMultibancoOnPresenceRequest.java
        │           │   │   │   └── StartMultibancoOnlineRequest.java
        │           │   │   └── response/
        │           │   │       ├── FeeResponse.java
        │           │   │       ├── MultibancoPaymentData.java
        │           │   │       ├── PaymentResponse.java
        │           │   │       ├── PaymentStatusResponse.java
        │           │   │       └── StartMultibancoOnlineResponse.java
        │           │   ├── repository/
        │           │   │   ├── FeeRepository.java
        │           │   │   ├── FeeSpecifications.java
        │           │   │   ├── GatewayNotificationRepository.java
        │           │   │   ├── GatewayPaymentAttemptRepository.java
        │           │   │   ├── PaymentRepository.java
        │           │   │   └── PaymentSpecifications.java
        │           │   └── service/
        │           │       ├── PaymentGatewayService.java
        │           │       ├── SS6Mapper.java
        │           │       └── SS6WebhookService.java
        │
        │     (ss7) ├── analytics/
        │           │   ├── application/
        │           │   │   ├── SS7Facade.java
        │           │   │   └── SS7FacadeImpl.java
        │           │   ├── controller/
        │           │   │   └── SS7Controller.java
        │           │   ├── dto/
        │           │   │   └── response/
        │           │   │       ├── ActiveRoleResponse.java
        │           │   │       ├── CompetitionAwardsResponse.java
        │           │   │       ├── DashboardResponse.java
        │           │   │       ├── FeeTypeAnalysisResponse.java
        │           │   │       ├── FinancialAnalysisResponse.java
        │           │   │       ├── FinancialReportResponse.java
        │           │   │       ├── FinancialSnapshotResponse.java
        │           │   │       ├── MedalCountResponse.java
        │           │   │       ├── MultidimensionalPerformanceResponse.java
        │           │   │       ├── PaymentMethodAnalysisResponse.java
        │           │   │       ├── ProfileStatisticsResponse.java
        │           │   │       ├── RoleHistoryResponse.java
        │           │   │       ├── SportReportResponse.java
        │           │   │       ├── TeamTrainingEvolutionResponse.java
        │           │   │       └── UpcomingActivityResponse.java
        │           │   └── service/
        │           │       ├── SS7AggregationService.java
        │           │       └── SS7ProfileService.java
        │
        └── resources/
            ├── application.yml
            └── db/
                └── migration/
```
