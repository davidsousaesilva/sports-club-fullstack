package com.sportsclub.teams.domain.valueobjects;

import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.teams.domain.enums.TeamType;

public record TeamData(
        String name,
        TeamType teamType,
        String seasonYear,
        boolean active,
        Modality modality) {
}