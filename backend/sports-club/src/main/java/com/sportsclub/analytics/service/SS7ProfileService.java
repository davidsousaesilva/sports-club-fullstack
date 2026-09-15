package com.sportsclub.analytics.service;

import com.sportsclub.activitytracking.repository.AttendanceRepository;
import com.sportsclub.activitytracking.repository.PerformanceRepository;

import org.springframework.stereotype.Service;

@Service
public class SS7ProfileService {
    private final AttendanceRepository attendanceRepository;

    public SS7ProfileService(
            AttendanceRepository attendanceRepository,
            PerformanceRepository performanceRepository) {

        this.attendanceRepository = attendanceRepository;
    }

    public Integer countPresent(Integer personId) {
        return (int) attendanceRepository.countByPresentTrueAndAthleteId(personId);
    }

    public Integer countAbsent(Integer personId) {
        return (int) attendanceRepository.countByPresentFalseAndAthleteId(personId);
    }
}