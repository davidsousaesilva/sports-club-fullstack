package com.sportsclub.activitytracking.domain.valueobjects;

import java.math.BigDecimal;

import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.sportscore.domain.entities.StatisticType;

public record PerformanceData(
                BigDecimal value,
                String note,
                StatisticType statisticType,
                Person coach,
                Training training,
                Event event) {
}