package com.sportsclub.activitytracking.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sportsclub.activitytracking.dto.response.AttendanceStatisticsResponse;
import com.sportsclub.activitytracking.dto.response.RecentAttendanceResponse;

@Service
public class AttendanceStatisticsService {

    public BigDecimal calculateRate(long present, long total) {
        if (total == 0) {
            return BigDecimal.ZERO;
        }

        return BigDecimal.valueOf(present)
                .divide(BigDecimal.valueOf(total), 4, RoundingMode.HALF_UP);
    }

    public AttendanceStatisticsResponse build(
            long present,
            long absent,
            List<RecentAttendanceResponse> recentAttendances) {

        long total = present + absent;

        return new AttendanceStatisticsResponse(
                calculateRate(present, total),
                Math.toIntExact(present),
                Math.toIntExact(absent),
                recentAttendances);
    }
}