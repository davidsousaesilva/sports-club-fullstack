package com.sportsclub.activitytracking.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Component;

import com.sportsclub.activitytracking.domain.entities.Attendance;
import com.sportsclub.activitytracking.domain.entities.Performance;
import com.sportsclub.activitytracking.dto.response.AttendanceResponse;
import com.sportsclub.activitytracking.dto.response.PerformanceResponse;
import com.sportsclub.activitytracking.dto.response.RecentAttendanceResponse;

@Component
public class SS5Mapper {

    public AttendanceResponse toAttendanceResponse(Attendance attendance) {
        if (attendance == null) {
            return null;
        }

        return new AttendanceResponse(
                attendance.getId(),
                attendance.getVersion(),
                attendance.isPresent(),
                attendance.getTraining() != null ? attendance.getTraining().getId() : null,
                attendance.getEvent() != null ? attendance.getEvent().getId() : null,
                attendance.getAthlete().getId(),
                attendance.getAthlete().getName(),
                attendance.isFreeTraining(),
                attendance.getTeam() != null ? attendance.getTeam().getId() : null,
                attendance.getTeam() != null ? attendance.getTeam().getName() : null,
                resolveAttendanceDate(attendance)
        );
    }

    public PerformanceResponse toPerformanceResponse(Performance performance) {
        if (performance == null) {
            return null;
        }

        return new PerformanceResponse(
                performance.getId(),
                performance.getVersion(),
                performance.getValue(),
                performance.getNote(),
                performance.getStatisticType() != null ? performance.getStatisticType().getId() : null,
                performance.getStatisticType() != null ? performance.getStatisticType().getName() : null,
                performance.getStatisticType() != null ? performance.getStatisticType().getUnit() : null,
                performance.getAthlete() != null ? performance.getAthlete().getId() : null,
                performance.getAthlete() != null ? performance.getAthlete().getName() : null,
                performance.getCoach() != null ? performance.getCoach().getId() : null,
                performance.getCoach() != null ? performance.getCoach().getName() : null,
                performance.getTraining() != null ? performance.getTraining().getId() : null,
                performance.getEvent() != null ? performance.getEvent().getId() : null
        );
    }

    public RecentAttendanceResponse toRecentAttendanceResponse(Attendance attendance) {
        if (attendance == null) {
            return null;
        }

        return new RecentAttendanceResponse(
                attendance.getAthlete() != null ? attendance.getAthlete().getName() : null,
                attendance.getTraining() != null ? attendance.getTraining().getDescription()
                        : attendance.getEvent() != null ? attendance.getEvent().getDescription()
                        : attendance.getTeam() != null ? attendance.getTeam().getName()
                        : null,
                attendance.isPresent(),
                resolveAttendanceDate(attendance));  
    }

    public List<AttendanceResponse> toAttendanceResponses(List<Attendance> attendances) {
        return attendances == null ? List.of() : attendances.stream().map(this::toAttendanceResponse).toList();
    }

    public List<PerformanceResponse> toPerformanceResponses(List<Performance> performances) {
        return performances == null ? List.of() : performances.stream().map(this::toPerformanceResponse).toList();
    }

    private LocalDate resolveAttendanceDate(Attendance attendance) {
        if (attendance.getTraining() != null) {
            return attendance.getTraining().getDate().toLocalDate();
        }

        if (attendance.getEvent() != null) {
            return attendance.getEvent().getDate().toLocalDate();
        }

        if (attendance.getAttendanceDate() != null) {
            return attendance.getAttendanceDate();
        }

        if (attendance.getCreatedAt() != null) {
            return attendance.getCreatedAt().toLocalDate();
        }

        return null;
    }

}