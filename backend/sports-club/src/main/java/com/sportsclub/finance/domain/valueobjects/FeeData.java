package com.sportsclub.finance.domain.valueobjects;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sportsclub.activities.domain.entities.CompetitionTeam;
import com.sportsclub.finance.domain.enums.FeeType;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.teams.domain.entities.Team;

public record FeeData(
        LocalDateTime dueDate,
        FeeType type,
        BigDecimal amount,
        LocalDateTime nextCycle,
        boolean recurrent,
        Person athlete,
        Team team,
        CompetitionTeam competitionTeamOrigin) {
}