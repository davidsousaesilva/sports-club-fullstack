package com.sportsclub.analytics.application;

import java.util.List;

import com.sportsclub.identity.domain.enums.Role;

import com.sportsclub.analytics.dto.response.*;

public interface SS7Facade {

    DashboardResponse calculateDashboard();

    SportReportResponse calculateSportReport();

    FinancialReportResponse calculateFinancialReport();

    ProfileStatisticsResponse getProfileStatistics(Integer personId);

    List<CalendarActivityResponse> getCalendarActivities(
            Integer month,
            Integer year,
            Integer personId,
            Role view
    );
}