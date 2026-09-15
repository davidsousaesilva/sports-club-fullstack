package com.sportsclub.activitytracking.application;

import java.time.LocalDate;
import java.util.List;

import com.sportsclub.activitytracking.dto.request.RegisterOrUpdateAttendanceRequest;
import com.sportsclub.activitytracking.dto.request.RegisterOrUpdatePerformancesRequest;
import com.sportsclub.activitytracking.dto.response.AggregatedPerformanceResponse;
import com.sportsclub.activitytracking.dto.response.AttendanceResponse;
import com.sportsclub.activitytracking.dto.response.AttendanceStatisticsResponse;

public interface SS5Facade {

    List<AttendanceResponse> listTrainingAttendances(Integer trainingId);

    List<AttendanceResponse> listEventAttendances(Integer eventId);

    List<AttendanceResponse> listWeeklyFreeTrainingAttendances(Integer teamId, LocalDate on);

    AttendanceResponse registerOrUpdateAttendance(RegisterOrUpdateAttendanceRequest request, Integer performedBy);

    List<AggregatedPerformanceResponse> listTrainingPerformances(Integer trainingId);

    List<AggregatedPerformanceResponse> listEventPerformances(Integer eventId);

    void registerOrUpdatePerformances(RegisterOrUpdatePerformancesRequest request, Integer performedBy);

    AttendanceStatisticsResponse calculateAttendanceStatistics();

    AttendanceStatisticsResponse calculateCoachAttendanceStatistics(Integer coachId);
}