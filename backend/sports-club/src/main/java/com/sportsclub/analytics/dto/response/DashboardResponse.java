package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardResponse(
                Integer totalAthletes,
                Integer totalNewAthletesThisMonth,
                Integer totalActiveTeams,
                BigDecimal attendanceRate,
                BigDecimal totalRevenueCurrentMonth,
                BigDecimal totalDebtsCurrentMonth,
                Map<String, BigDecimal> modalityTeamsPercentage,
                List<FinancialSnapshotResponse> financialSnapshotQuarter,
                List<DebtFeeResponse> debtFees,
                List<UpcomingActivityResponse> upcomingActivities) {
}