package com.sportsclub.activitytracking.service;

import org.springframework.stereotype.Service;

@Service
public class PerformanceRulesService {

    public void validateContext(Integer trainingId, Integer eventId) {
        if ((trainingId == null && eventId == null) || (trainingId != null && eventId != null)) {
            throw new IllegalArgumentException("Exactly one of trainingId or eventId must be provided.");
        }
    }
}