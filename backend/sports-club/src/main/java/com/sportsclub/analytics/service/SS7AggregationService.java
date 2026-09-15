package com.sportsclub.analytics.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.sportsclub.activitytracking.repository.PerformanceRepository;
import com.sportsclub.analytics.dto.response.MedalCountResponse;
import com.sportsclub.analytics.dto.response.FinancialAnalysisResponse;
import com.sportsclub.activities.domain.entities.CompetitionTeam;
import com.sportsclub.analytics.dto.response.CompetitionAwardsResponse;
import com.sportsclub.analytics.dto.response.MultidimensionalPerformanceResponse;
import com.sportsclub.analytics.dto.response.TeamTrainingEvolutionResponse;
import com.sportsclub.activities.repository.CompetitionRepository;
import com.sportsclub.activities.repository.EventRepository;
import com.sportsclub.activities.repository.TrainingRepository;
import com.sportsclub.activitytracking.repository.AttendanceRepository;
import com.sportsclub.analytics.dto.response.FeeTypeAnalysisResponse;
import com.sportsclub.analytics.dto.response.FinancialSnapshotResponse;
import com.sportsclub.analytics.dto.response.PaymentMethodAnalysisResponse;
import com.sportsclub.analytics.dto.response.TeamTrainingEvolutionResponse;
import com.sportsclub.analytics.dto.response.UpcomingActivityResponse;
import com.sportsclub.analytics.dto.response.DebtFeeResponse;
import com.sportsclub.finance.domain.enums.FeeStatus;
import com.sportsclub.finance.repository.FeeRepository;
import com.sportsclub.finance.repository.PaymentRepository;
import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.identity.repository.PersonRepository;
import com.sportsclub.identity.repository.PersonRoleRepository;
import com.sportsclub.sportscore.repository.ModalityRepository;
import com.sportsclub.teams.repository.TeamRepository;
import com.sportsclub.activitytracking.domain.entities.Performance;
import com.sportsclub.analytics.dto.response.CalendarActivityResponse;
import com.sportsclub.analytics.dto.response.CalendarActivityType;
import com.sportsclub.analytics.dto.response.CompetitionAwardsResponse;
import com.sportsclub.teams.repository.TeamMemberRepository;

import org.springframework.stereotype.Service;

@Service
public class SS7AggregationService {

    private final PersonRoleRepository personRoleRepository;
    private final TeamRepository teamRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;
    private final PaymentRepository paymentRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final CompetitionRepository competitionRepository;
    private final TrainingRepository trainingRepository;
    private final EventRepository eventRepository;
    private final PerformanceRepository performanceRepository;
    private static final String GRADE_STATISTIC_NAME = "nota";

    public SS7AggregationService(
            PersonRepository personRepository,
            PersonRoleRepository personRoleRepository,
            TeamRepository teamRepository,
            CompetitionRepository competitionRepository,
            TrainingRepository trainingRepository,
            AttendanceRepository attendanceRepository,
            FeeRepository feeRepository,
            PaymentRepository paymentRepository,
            EventRepository eventRepository,
            ModalityRepository modalityRepository,
            TeamMemberRepository teamMemberRepository,
            PerformanceRepository performanceRepository) {
        this.personRoleRepository = personRoleRepository;
        this.teamRepository = teamRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeRepository = feeRepository;
        this.paymentRepository = paymentRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.competitionRepository = competitionRepository;
        this.trainingRepository = trainingRepository;
        this.eventRepository = eventRepository;
        this.performanceRepository = performanceRepository;
    }

    public Integer countAthletes() {
        return (int) personRoleRepository.findByRoleAndEndDateIsNull(Role.ATHLETE).size();
    }

    public Integer countNewAthletesThisMonth() {
        LocalDate start = LocalDate.now().withDayOfMonth(1);
        LocalDate end = start.plusMonths(1).minusDays(1);
        return personRoleRepository.findByRoleAndStartDateBetween(Role.ATHLETE, start, end).size();
    }

    public Integer countActiveTeams() {
        return (int) teamRepository.countByActiveTrue();
    }

    public BigDecimal attendanceRate() {
        long present = attendanceRepository.countByPresentTrue();
        long absent = attendanceRepository.countByPresentFalse();
        long total = present + absent;
        if (total == 0)
            return BigDecimal.ZERO;
        return BigDecimal.valueOf(present).divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }

    public BigDecimal currentMonthRevenue() {
        LocalDateTime start = LocalDate.now()
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime end = start.plusMonths(1);

        return paymentRepository.sumConfirmedAmountBetween(start, end);
    }

    public BigDecimal currentMonthDebt() {
        LocalDateTime start = LocalDate.now()
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime end = start.plusMonths(1);

        return feeRepository.sumAmountByStatusInAndDueDateBetween(
                List.of(FeeStatus.DEBT),
                start,
                end);
    }

    public Map<String, BigDecimal> modalityTeamsPercentage() {
        List<Object[]> rows = teamRepository.countActiveTeamsByModality();

        long total = rows.stream()
                .mapToLong(row -> (Long) row[1])
                .sum();

        Map<String, BigDecimal> result = new LinkedHashMap<>();

        if (total == 0) {
            return result;
        }

        for (Object[] row : rows) {
            String modalityName = (String) row[0];
            Long count = (Long) row[1];

            BigDecimal percentage = BigDecimal.valueOf(count)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);

            result.put(modalityName, percentage);
        }

        return result;
    }

    public List<YearMonth> currentQuarterMonths() {
        YearMonth currentMonth = YearMonth.now();

        return List.of(
                currentMonth.minusMonths(2),
                currentMonth.minusMonths(1),
                currentMonth
        );
    }

    public Integer totalCoaches() {
        return (int) personRoleRepository.findByRoleAndEndDateIsNull(Role.COACH).size();
    }

    public BigDecimal paymentRate() {
        long paid = feeRepository.countByStatus(FeeStatus.PAID);
        long total = feeRepository.countByStatus(FeeStatus.PAID)
                + feeRepository.countByStatus(FeeStatus.DEBT)
                + feeRepository.countByStatus(FeeStatus.UNPAID);
        if (total == 0)
            return BigDecimal.ZERO;
        return BigDecimal.valueOf(paid).divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }

    public BigDecimal zero() {
        return BigDecimal.ZERO;
    }

    public BigDecimal totalReceived() {
        return paymentRepository.sumConfirmedAmount();
    }

    public BigDecimal totalDebt() {
        return feeRepository.sumAmountByStatusIn(
                List.of(FeeStatus.DEBT));
    }

    public Integer pendingFeesCount() {
        return (int) feeRepository.countFeesByStatus(FeeStatus.UNPAID);
    }

    public Integer debtFeesCount() {
        return (int) feeRepository.countFeesByStatus(FeeStatus.DEBT);
    }


    public List<DebtFeeResponse> debtFees() {
        return feeRepository.findAll()
                .stream()
                .filter(fee -> FeeStatus.DEBT.equals(fee.getStatus()))
                .map(fee -> new DebtFeeResponse(
                        fee.getId(),
                        fee.getAmount(),
                        fee.getDueDate().toLocalDate()
                ))
                .toList();
    }

    public Map<String, BigDecimal> feeStatusState() {
        Map<String, BigDecimal> result = new LinkedHashMap<>();

        result.put("UNPAID", feeRepository.sumAmountByStatus(FeeStatus.UNPAID));
        result.put("PAID", feeRepository.sumAmountByStatus(FeeStatus.PAID));
        result.put("DEBT", feeRepository.sumAmountByStatus(FeeStatus.DEBT));

        return result;
    }

    public Map<String, BigDecimal> revenuesBySource() {
        Map<String, BigDecimal> result = new LinkedHashMap<>();

        result.put("CASH", paymentRepository.sumConfirmedAmountByMethod(
                com.sportsclub.finance.domain.enums.PaymentMethod.CASH));

        result.put("MULTIBANCO", paymentRepository.sumConfirmedAmountByMethod(
                com.sportsclub.finance.domain.enums.PaymentMethod.MULTIBANCO));

        return result;
    }

    public FeeTypeAnalysisResponse feeTypeAnalysis() {
        return new FeeTypeAnalysisResponse(
                (int) feeRepository.countFeesByType(com.sportsclub.finance.domain.enums.FeeType.REGISTRATION),
                feeRepository.averageAmountByType(com.sportsclub.finance.domain.enums.FeeType.REGISTRATION),

                (int) feeRepository.countFeesByType(com.sportsclub.finance.domain.enums.FeeType.MONTHLY_FEE),
                feeRepository.averageAmountByType(com.sportsclub.finance.domain.enums.FeeType.MONTHLY_FEE),

                (int) feeRepository.countFeesByType(com.sportsclub.finance.domain.enums.FeeType.COMPETITION_FEE),
                feeRepository.averageAmountByType(com.sportsclub.finance.domain.enums.FeeType.COMPETITION_FEE));
    }

    public PaymentMethodAnalysisResponse paymentMethodAnalysis() {
        var multibanco = com.sportsclub.finance.domain.enums.PaymentMethod.MULTIBANCO;
        var cash = com.sportsclub.finance.domain.enums.PaymentMethod.CASH;

        return new PaymentMethodAnalysisResponse(
                (int) paymentRepository.countConfirmedByMethod(multibanco),
                paymentRepository.sumConfirmedAmountByMethod(multibanco),
                paymentRepository.averageConfirmedAmountByMethod(multibanco),

                (int) paymentRepository.countConfirmedByMethod(cash),
                paymentRepository.sumConfirmedAmountByMethod(cash),
                paymentRepository.averageConfirmedAmountByMethod(cash));
    }

    public Map<String, BigDecimal> modalityAthletesPercentage() {
        List<Object[]> rows = teamMemberRepository.countActiveAthletesByModality();

        long total = rows.stream()
                .mapToLong(row -> (Long) row[1])
                .sum();

        Map<String, BigDecimal> result = new LinkedHashMap<>();

        if (total == 0) {
            return result;
        }

        for (Object[] row : rows) {
            String modalityName = (String) row[0];
            Long count = (Long) row[1];

            BigDecimal percentage = BigDecimal.valueOf(count)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);

            result.put(modalityName, percentage);
        }

        return result;
    }

    public Map<String, BigDecimal> teamAttendanceRate() {
        List<Object[]> rows = attendanceRepository.attendanceCountByTeam();

        Map<String, BigDecimal> result = new LinkedHashMap<>();

        for (Object[] row : rows) {
            String teamName = (String) row[0];
            Number presentCount = (Number) row[1];
            Number totalCount = (Number) row[2];

            if (totalCount.longValue() == 0) {
                result.put(teamName, BigDecimal.ZERO);
                continue;
            }

            BigDecimal rate = BigDecimal.valueOf(presentCount.longValue())
                    .divide(BigDecimal.valueOf(totalCount.longValue()), 2, RoundingMode.HALF_UP);

            result.put(teamName, rate);
        }

        return result;
    }

    public List<CalendarActivityResponse> calendarActivities(
            Integer month,
            Integer year,
            Integer personId,
            Role view
    ) {
        LocalDateTime startOfMonth = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);

        List<CalendarActivityResponse> result = new java.util.ArrayList<>();

        result.addAll(trainingRepository.findAll().stream()
                .filter(training -> {
                    LocalDateTime start = training.getDate();
                    LocalDateTime end = training.getDate().plusMinutes(training.getDuration());

                    return overlapsMonth(start, end, startOfMonth, endOfMonth);
                })
                .filter(training -> shouldIncludeTeamActivity(
                        training.getTeam().getId(),
                        personId,
                        view))
                .map(training -> new CalendarActivityResponse(
                        training.getId(),
                        CalendarActivityType.TRAINING,
                        training.getDescription(),
                        training.getDate(),
                        training.getDate().plusMinutes(training.getDuration()),
                        training.getTeam().getModality().getName(),
                        training.getComplex() != null ? training.getComplex().getName() : null,
                        training.getTeam().getName(),
                        null,
                        null))
                .toList());

        result.addAll(eventRepository.findAll().stream()
                .filter(event -> {
                    LocalDateTime start = event.getDate();
                    LocalDateTime end = event.getDate().plusMinutes(event.getDuration());

                    return overlapsMonth(start, end, startOfMonth, endOfMonth);
                })
                .filter(event -> {
                    if (view == null || personId == null) {
                        return true;
                    }

                    if (view == Role.MANAGER || view == Role.EMPLOYEE) {
                        return true;
                    }

                    List<String> teamNames = eventRepository.findTeamNamesByEventId(event.getId());

                    if (teamNames.isEmpty()) {
                        return false;
                    }

                    return teamMemberRepository.findAll().stream()
                            .anyMatch(member -> teamNames.contains(member.getTeam().getName())
                                    && member.getPerson().getId().equals(personId)
                                    && member.getEndDate() == null
                                    && member.getRelationship().name().equals(view.name()));
                })
                .map(event -> {
                    LocalDateTime start = event.getDate();
                    LocalDateTime end = event.getDate().plusMinutes(event.getDuration());

                    List<String> teamNames = eventRepository.findTeamNamesByEventId(event.getId());

                    return new CalendarActivityResponse(
                            event.getId(),
                            CalendarActivityType.EVENT,
                            event.getDescription(),
                            start,
                            end,
                            event.getModality().getName(),
                            event.getComplex() != null ? event.getComplex().getName() : null,
                            null,
                            teamNames,
                            event.getCompetition() != null ? event.getCompetition().getName() : null);
                })
                .toList());

        return result.stream()
                .sorted(java.util.Comparator.comparing(CalendarActivityResponse::start))
                .toList();
    }
    
    public List<FinancialSnapshotResponse> financialSnapshotQuarter() {
        return currentQuarterMonths()
                .stream()
                .map(month -> {
                    LocalDateTime start = month.atDay(1).atStartOfDay();
                    LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();

                    BigDecimal revenue = zeroIfNull(
                            paymentRepository.sumConfirmedAmountBetween(start, end));

                    BigDecimal debt = zeroIfNull(
                            feeRepository.sumAmountByStatusInAndDueDateBetween(
                                    List.of(FeeStatus.DEBT),
                                    start,
                                    end));

                    return new FinancialSnapshotResponse(revenue, debt);
                })
                .toList();
    }

    public List<UpcomingActivityResponse> upcomingActivities() {
        LocalDateTime now = LocalDateTime.now();

        List<UpcomingActivityResponse> result = new ArrayList<>();

        result.addAll(trainingRepository.findAll()
                .stream()
                .filter(training -> !training.getDate().isBefore(now))
                .map(training -> new UpcomingActivityResponse(
                        training.getId(),
                        "Treino - " + training.getDescription(),
                        training.getDate().toLocalDate()))
                .toList());

        result.addAll(eventRepository.findAll()
                .stream()
                .filter(event -> !event.getDate().isBefore(now))
                .map(event -> new UpcomingActivityResponse(
                        event.getId(),
                        "Evento - " + event.getDescription(),
                        event.getDate().toLocalDate()))
                .toList());

        return result.stream()
                .sorted(Comparator.comparing(UpcomingActivityResponse::date))
                .limit(5)
                .toList();
    }



    public Map<String, TeamTrainingEvolutionResponse> trainingAttendanceEvolution() {
        Map<String, TeamTrainingEvolutionResponse> result = new LinkedHashMap<>();

        for (YearMonth month : currentQuarterMonths()) {
            LocalDateTime start = month.atDay(1).atStartOfDay();
            LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();

            int totalTrainings = (int) trainingRepository.findAll()
                    .stream()
                    .filter(training -> {
                        LocalDateTime trainingDate = training.getDate();
                        return !trainingDate.isBefore(start) && trainingDate.isBefore(end);
                    })
                    .count();

            long present = attendanceRepository.findAll()
                    .stream()
                    .filter(attendance -> attendance.getTraining() != null
                            && attendance.getTraining().getDate() != null
                            && !attendance.getTraining().getDate().isBefore(start)
                            && attendance.getTraining().getDate().isBefore(end)
                            && attendance.isPresent())
                    .count();

            long totalAttendances = attendanceRepository.findAll()
                    .stream()
                    .filter(attendance -> attendance.getTraining() != null
                            && attendance.getTraining().getDate() != null
                            && !attendance.getTraining().getDate().isBefore(start)
                            && attendance.getTraining().getDate().isBefore(end))
                    .count();

            BigDecimal attendanceRate = totalAttendances == 0
                    ? BigDecimal.ZERO
                    : BigDecimal.valueOf(present)
                            .divide(BigDecimal.valueOf(totalAttendances), 2, RoundingMode.HALF_UP);

            result.put(
                    month.getMonth().name().toLowerCase(),
                    new TeamTrainingEvolutionResponse(totalTrainings, attendanceRate));
        }

        return result;
    }

    public Map<String, BigDecimal> averagePerformanceByModality() {
        Map<String, BigDecimal> sums = new LinkedHashMap<>();
        Map<String, Long> counts = new LinkedHashMap<>();

        performanceRepository.findAll()
                .stream()
                .filter(performance -> performance.getValue() != null)
                .filter(this::isGradePerformance)
                .forEach(performance -> {
                    String modalityName = resolvePerformanceModalityName(performance);

                    if (modalityName == null) {
                        return;
                    }

                    sums.merge(modalityName, performance.getValue(), BigDecimal::add);
                    counts.merge(modalityName, 1L, Long::sum);
                });

        Map<String, BigDecimal> result = new LinkedHashMap<>();

        sums.forEach((modalityName, sum) -> {
            long count = counts.getOrDefault(modalityName, 0L);

            BigDecimal average = count == 0
                    ? BigDecimal.ZERO
                    : sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);

            result.put(modalityName, average);
        });

        return result;
    }


    public Map<String, MultidimensionalPerformanceResponse> multidimensionalPerformance() {
        Map<String, BigDecimal> attendanceByModality = attendanceRateByModality();
        Map<String, BigDecimal> performanceByModality = averagePerformanceByModality();

        Map<String, Integer> competitivenessByModality = new LinkedHashMap<>();

        eventRepository.findAll()
                .stream()
                .filter(event -> event.getModality() != null)
                .forEach(event -> {
                    String modalityName = event.getModality().getName();
                    int teamsCount = eventRepository.findTeamNamesByEventId(event.getId()).size();

                    competitivenessByModality.merge(modalityName, teamsCount, Integer::sum);
                });

        Map<String, MultidimensionalPerformanceResponse> result = new LinkedHashMap<>();

        attendanceByModality.forEach((modalityName, attendanceRate) -> {
            int attendance = attendanceRate.setScale(0, RoundingMode.HALF_UP).intValue();
            int competitiveness = competitivenessByModality.getOrDefault(modalityName, 0);

            BigDecimal averageGrade = performanceByModality.getOrDefault(
                    modalityName,
                    BigDecimal.ZERO);

            int performance = averageGrade
                    .multiply(BigDecimal.TEN)
                    .setScale(0, RoundingMode.HALF_UP)
                    .intValue();

            result.put(
                    modalityName,
                    new MultidimensionalPerformanceResponse(
                            attendance,
                            performance,
                            competitiveness));
        });

        return result;
    }
    
    private int medalIndex(String finalResult) {
        if (finalResult == null) {
            return -1;
        }

        return switch (finalResult.trim()) {
            case "1º" -> 0;
            case "2º" -> 1;
            case "3º" -> 2;
            default -> -1;
        };
    }

    public Map<String, CompetitionAwardsResponse> competitionAwards() {
        Map<String, int[]> counters = new LinkedHashMap<>();

        competitionRepository.findAll().forEach(competition ->
                competition.getCompetitionTeams()
                        .stream()
                        .filter(competitionTeam -> competitionTeam.getTeam() != null)
                        .forEach(competitionTeam -> {
                            int medalIndex = medalIndex(
                                    competitionTeam.getFinalResult()
                            );

                            if (medalIndex < 0) {
                                return;
                            }

                            String teamName = competitionTeam.getTeam().getName();

                            int[] medals = counters.computeIfAbsent(
                                    teamName,
                                    key -> new int[] { 0, 0, 0 }
                            );

                            medals[medalIndex]++;
                        })
        );

        Map<String, CompetitionAwardsResponse> result = new LinkedHashMap<>();

        counters.forEach((teamName, medals) ->
                result.put(
                        teamName,
                        new CompetitionAwardsResponse(
                                medals[0],
                                medals[1],
                                medals[2]
                        )
                )
        );

        return result;
    }

    public Map<String, FinancialAnalysisResponse> financialAnalysis() {
        Map<String, FinancialAnalysisResponse> result = new LinkedHashMap<>();

        for (YearMonth month : currentQuarterMonths()) {
            LocalDateTime start = month.atDay(1).atStartOfDay();
            LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();

            BigDecimal revenue = zeroIfNull(
                    paymentRepository.sumConfirmedAmountBetween(start, end));

            BigDecimal debt = zeroIfNull(
                    feeRepository.sumAmountByStatusInAndDueDateBetween(
                            List.of(FeeStatus.DEBT),
                            start,
                            end));

            result.put(
                    month.getMonth().name().toLowerCase(),
                    new FinancialAnalysisResponse(revenue, debt));
        }

        return result;
    }

    public Map<String, BigDecimal> profitTrend() {
        Map<String, BigDecimal> result = new LinkedHashMap<>();

        for (YearMonth month : currentQuarterMonths()) {
            LocalDateTime start = month.atDay(1).atStartOfDay();
            LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();

            BigDecimal revenue = zeroIfNull(
                    paymentRepository.sumConfirmedAmountBetween(start, end));

            BigDecimal debt = zeroIfNull(
                    feeRepository.sumAmountByStatusInAndDueDateBetween(
                            List.of(FeeStatus.DEBT),
                            start,
                            end));

            result.put(
                    month.getMonth().name().toLowerCase(),
                    revenue.subtract(debt));
        }

        return result;
    }

    public Integer trainingParticipationsForPerson(Integer personId) {
        return (int) attendanceRepository.findAll()
                .stream()
                .filter(attendance -> attendance.getAthlete() != null)
                .filter(attendance -> attendance.getAthlete().getId().equals(personId))
                .filter(attendance -> attendance.getTraining() != null)
                .filter(attendance -> !attendance.isFreeTraining())
                .filter(attendance -> attendance.isPresent())
                .count();
    }

    public Integer eventParticipationsForPerson(Integer personId) {
        return (int) attendanceRepository.findAll()
                .stream()
                .filter(attendance -> attendance.getAthlete() != null)
                .filter(attendance -> attendance.getAthlete().getId().equals(personId))
                .filter(attendance -> attendance.getEvent() != null)
                .filter(attendance -> attendance.isPresent())
                .count();
    }

    public Integer freeTrainingParticipationsForPerson(Integer personId) {
        return (int) attendanceRepository.findAll()
                .stream()
                .filter(attendance -> attendance.getAthlete() != null)
                .filter(attendance -> attendance.getAthlete().getId().equals(personId))
                .filter(attendance -> attendance.getTraining() == null)
                .filter(attendance -> attendance.isFreeTraining())
                .filter(attendance -> attendance.isPresent())
                .count();
    }

    public MedalCountResponse medalCountForPerson(Integer personId) {
        int[] medals = new int[] { 0, 0, 0 };

        List<Integer> personTeamIds = teamMemberRepository.findAll()
                .stream()
                .filter(member -> member.getPerson() != null)
                .filter(member -> Objects.equals(
                        member.getPerson().getId(),
                        personId
                ))
                .filter(member -> member.getTeam() != null)
                .map(member -> member.getTeam().getId())
                .distinct()
                .toList();

        if (personTeamIds.isEmpty()) {
            return new MedalCountResponse(0, 0, 0);
        }

        competitionRepository.findAll()
                .forEach(competition ->
                        competition.getCompetitionTeams()
                                .stream()
                                .filter(competitionTeam -> competitionTeam.getTeam() != null)
                                .filter(competitionTeam -> personTeamIds.contains(
                                        competitionTeam.getTeam().getId()
                                ))
                                .forEach(competitionTeam -> {
                                    int medalIndex = medalIndex(
                                            competitionTeam.getFinalResult()
                                    );

                                    if (medalIndex >= 0) {
                                        medals[medalIndex]++;
                                    }
                                })
                );

        return new MedalCountResponse(
                medals[0],
                medals[1],
                medals[2]
        );
    }

    public BigDecimal averageTrainingEvaluationsForPerson(Integer personId) {
        return zeroIfNull(performanceRepository.averageTrainingPerformanceByAthleteId(personId))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public Integer totalTrainingEvaluationsForPerson(Integer personId) {
        return (int) performanceRepository.countByAthleteIdAndTrainingIsNotNull(personId);
    }

    public BigDecimal averageEventEvaluationsForPerson(Integer personId) {
        return zeroIfNull(performanceRepository.averageEventPerformanceByAthleteId(personId))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public Integer totalEventEvaluationsForPerson(Integer personId) {
        return (int) performanceRepository.countByAthleteIdAndEventIsNotNull(personId);
    }

    
    private String resolveTemporalStatus(LocalDateTime start, LocalDateTime end) {
        LocalDateTime now = LocalDateTime.now();

        if (end != null && end.isBefore(now)) {
            return "PAST";
        }

        if (start != null && start.isAfter(now)) {
            return "UPCOMING";
        }

        return "ONGOING";
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }



    private boolean overlapsMonth(
            LocalDateTime activityStart,
            LocalDateTime activityEnd,
            LocalDateTime monthStart,
            LocalDateTime monthEnd
    ) {
        return activityStart.isBefore(monthEnd)
                && activityEnd.isAfter(monthStart);
    }

    private boolean shouldIncludeTeamActivity(
            Integer teamId,
            Integer personId,
            Role view
    ) {
        if (view == null || personId == null) {
            return true;
        }

        if (view == Role.MANAGER || view == Role.EMPLOYEE) {
            return true;
        }

        return teamMemberRepository.findAll().stream()
                .anyMatch(member -> member.getTeam().getId().equals(teamId)
                        && member.getPerson().getId().equals(personId)
                        && member.getEndDate() == null
                        && member.getRelationship().name().equals(view.name()));
    }
    
    private boolean isGradePerformance(Performance performance) {
        return performance.getStatisticType() != null
                && performance.getStatisticType().getName() != null
                && GRADE_STATISTIC_NAME.equalsIgnoreCase(
                        performance.getStatisticType().getName().trim());
    }

    private String resolvePerformanceModalityName(Performance performance) {
        if (performance.getTraining() != null
                && performance.getTraining().getTeam() != null
                && performance.getTraining().getTeam().getModality() != null) {

            return performance.getTraining()
                    .getTeam()
                    .getModality()
                    .getName();
        }

        if (performance.getEvent() != null
                && performance.getEvent().getModality() != null) {

            return performance.getEvent()
                    .getModality()
                    .getName();
        }

        return null;
    }

    private Map<String, BigDecimal> attendanceRateByModality() {
        Map<String, long[]> counters = new LinkedHashMap<>();

        attendanceRepository.findAll()
                .stream()
                .filter(attendance -> attendance.getTraining() != null)
                .filter(attendance -> attendance.getTraining().getTeam() != null)
                .filter(attendance -> attendance.getTraining().getTeam().getModality() != null)
                .forEach(attendance -> {
                    String modalityName = attendance.getTraining()
                            .getTeam()
                            .getModality()
                            .getName();

                    long[] values = counters.computeIfAbsent(
                            modalityName,
                            key -> new long[] { 0L, 0L });

                    if (attendance.isPresent()) {
                        values[0]++;
                    }

                    values[1]++;
                });

        Map<String, BigDecimal> result = new LinkedHashMap<>();

        counters.forEach((modalityName, values) -> {
            long present = values[0];
            long total = values[1];

            BigDecimal rate = total == 0
                    ? BigDecimal.ZERO
                    : BigDecimal.valueOf(present)
                            .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100));

            result.put(modalityName, rate);
        });

        return result;
    }

}