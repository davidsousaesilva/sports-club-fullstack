package com.sportsclub.analytics.application;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.sportsclub.analytics.dto.response.*;
import com.sportsclub.analytics.service.SS7AggregationService;
import com.sportsclub.analytics.service.SS7ProfileService;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.dto.response.ProfileDataResponse;
import com.sportsclub.analytics.dto.response.CalendarActivityResponse;
import com.sportsclub.identity.domain.enums.Role;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SS7FacadeImpl implements SS7Facade {

        private final SS7AggregationService aggregationService;
        private final SS7ProfileService profileService;

        public SS7FacadeImpl(
                        SS7AggregationService aggregationService,
                        SS7ProfileService profileService) {
                this.aggregationService = aggregationService;
                this.profileService = profileService;
        }

        @Override
        public DashboardResponse calculateDashboard() {
                return new DashboardResponse(
                                aggregationService.countAthletes(),
                                aggregationService.countNewAthletesThisMonth(),
                                aggregationService.countActiveTeams(),
                                aggregationService.attendanceRate(),
                                aggregationService.currentMonthRevenue(),
                                aggregationService.currentMonthDebt(),
                                aggregationService.modalityTeamsPercentage(),
                                aggregationService.financialSnapshotQuarter(),
                                aggregationService.debtFees(),
                                aggregationService.upcomingActivities());
        }

        @Override
        public SportReportResponse calculateSportReport() {
                return new SportReportResponse(
                                aggregationService.countAthletes(),
                                aggregationService.totalCoaches(),
                                aggregationService.countActiveTeams(),
                                aggregationService.attendanceRate(),
                                aggregationService.trainingAttendanceEvolution(),
                                aggregationService.multidimensionalPerformance(),
                                aggregationService.teamAttendanceRate(),
                                aggregationService.averagePerformanceByModality(),
                                aggregationService.modalityTeamsPercentage(),
                                aggregationService.modalityAthletesPercentage(),
                                aggregationService.competitionAwards());
        }


        @Override
        public FinancialReportResponse calculateFinancialReport() {
                return new FinancialReportResponse(
                                aggregationService.totalReceived(),
                                aggregationService.totalDebt(),
                                aggregationService.pendingFeesCount(),
                                aggregationService.paymentRate(),
                                aggregationService.financialAnalysis(),
                                aggregationService.profitTrend(),
                                aggregationService.feeStatusState(),
                                aggregationService.revenuesBySource(),
                                aggregationService.feeTypeAnalysis(),
                                aggregationService.paymentMethodAnalysis());
        }


        @Override
        public ProfileStatisticsResponse getProfileStatistics(Integer personId) {
               return new ProfileStatisticsResponse(
                               aggregationService.medalCountForPerson(personId),
                               aggregationService.averageTrainingEvaluationsForPerson(personId),
                               aggregationService.totalTrainingEvaluationsForPerson(personId),
                               aggregationService.averageEventEvaluationsForPerson(personId),
                               aggregationService.totalEventEvaluationsForPerson(personId),
                               profileService.countPresent(personId),
                               profileService.countAbsent(personId),
                               aggregationService.trainingParticipationsForPerson(personId),
                               aggregationService.eventParticipationsForPerson(personId),
                               aggregationService.freeTrainingParticipationsForPerson(personId));
       }



        @Override
        public List<CalendarActivityResponse> getCalendarActivities(
                Integer month,
                Integer year,
                Integer personId,
                Role view
        ) {
        return aggregationService.calendarActivities(month, year, personId, view);
        }
}