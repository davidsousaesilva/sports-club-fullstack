package com.sportsclub.activitytracking.domain.valueobjects;

import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.teams.domain.entities.Team;

public record AttendanceData(
        boolean present,
        boolean freeTraining,
        Training training,
        Event event,
        Team team) {
}