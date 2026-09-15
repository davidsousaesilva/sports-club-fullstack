package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public record SportReportResponse(
        Integer totalAthletes,
        Integer totalCoaches,
        Integer totalActiveTeams,
        BigDecimal attendanceRate,
        Map<String, TeamTrainingEvolutionResponse> trainingAttendanceEvolution,
        Map<String, MultidimensionalPerformanceResponse> multidimensionalPerformance,
        Map<String, BigDecimal> teamAttendanceRate,
        Map<String, BigDecimal> averagePerformanceByModality,
        Map<String, BigDecimal> modalityTeamsPercentage,
        Map<String, BigDecimal> modalityAthletesPercentage,
        Map<String, CompetitionAwardsResponse> competitionAwards) {
}