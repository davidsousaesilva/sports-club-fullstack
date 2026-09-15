package com.sportsclub.activitytracking.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.activitytracking.dto.request.RegisterOrUpdateAttendanceRequest;
import com.sportsclub.activitytracking.repository.AttendanceRepository;
import com.sportsclub.teams.domain.entities.Team;

import com.sportsclub.activitytracking.service.MaxWeeklyAttendancesExceededException;

@Service
public class AttendanceRulesService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceRulesService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public void validateContext(Integer trainingId, Integer eventId, Boolean freeTraining, Integer teamId) {
        boolean isFreeTraining = Boolean.TRUE.equals(freeTraining);
        boolean hasTraining = trainingId != null;
        boolean hasEvent = eventId != null;
        boolean hasTeam = teamId != null;

        if (isFreeTraining) {
            if (hasTraining || hasEvent) {
                throw new IllegalArgumentException("Free training attendance cannot have trainingId or eventId.");
            }

            if (!hasTeam) {
                throw new IllegalArgumentException("Team id is required for free training attendance.");
            }

            return;
        }

        if (hasTraining == hasEvent) {
            throw new IllegalArgumentException("Exactly one of trainingId or eventId must be provided.");
        }
    }

    public void validateBusinessRules(
            RegisterOrUpdateAttendanceRequest request,
            Training training,
            Event event,
            Team team) {

        boolean freeTraining = Boolean.TRUE.equals(request.freeTraining());

        if (freeTraining) {
            if (training != null || event != null) {
                throw new IllegalStateException("Free training attendance cannot refer to a training or event.");
            }

            if (team == null) {
                throw new IllegalStateException("Free training attendance requires a team.");
            }

            LocalDate attendanceDate = request.attendanceDate();

            if (attendanceDate == null) {
                throw new IllegalStateException("Free training attendance requires an attendance date.");
            }

            if (attendanceDate.isAfter(LocalDate.now())) {
                throw new IllegalStateException("Free training attendance cannot be registered for a future date.");
            }

            validateWeeklyFreeTrainingLimit(request, team);
            return;
        }

        if (event != null && team != null) {
            throw new IllegalStateException("Attendance in event context cannot have a team.");
        }

        if (training == null && team != null) {
            throw new IllegalStateException("Team can only be set in training context.");
        }
    }

    private void validateWeeklyFreeTrainingLimit(
            RegisterOrUpdateAttendanceRequest request,
            Team team) {

        if (!Boolean.TRUE.equals(request.freeTraining())) {
            return;
        }

        if (!Boolean.TRUE.equals(request.present())) {
            return;
        }

        if (team == null || team.getModality() == null) {
            return;
        }

        Integer maxWeeklyAttendances = team.getModality().getMaxPresencesPerWeek();

        if (maxWeeklyAttendances == null || maxWeeklyAttendances == -1) {
            return;
        }

        LocalDate attendanceDate = request.attendanceDate();
        LocalDate weekStartDate = attendanceDate.with(DayOfWeek.MONDAY);
        LocalDate weekEndDate = weekStartDate.plusWeeks(1);

        long currentWeeklyAttendances = attendanceRepository.countWeeklyFreeTrainingAttendances(
                request.athleteId(),
                team.getId(),
                weekStartDate,
                weekEndDate
        );

        if (currentWeeklyAttendances >= maxWeeklyAttendances) {
            throw new MaxWeeklyAttendancesExceededException(
                    request.athleteId(),
                    team.getId(),
                    team.getModality().getId(),
                    currentWeeklyAttendances,
                    maxWeeklyAttendances,
                    weekStartDate,
                    weekEndDate
            );
        }
    }
}