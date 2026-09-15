package com.sportsclub.activitytracking.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record AttendanceStatisticsResponse(
        BigDecimal attendanceRate,
        Integer attendances,
        Integer absences,
        List<RecentAttendanceResponse> recentAttendances) {
}