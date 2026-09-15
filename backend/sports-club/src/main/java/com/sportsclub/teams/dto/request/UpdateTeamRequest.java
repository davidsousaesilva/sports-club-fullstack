package com.sportsclub.teams.dto.request;

import com.sportsclub.shared.validation.ValidationPatterns;
import com.sportsclub.teams.domain.enums.TeamType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdateTeamRequest(
        @NotNull(message = "Version is required.")
        Long version,

        @NotBlank(message = "Name is required.")
        @Pattern(
                regexp = ValidationPatterns.TEAM_NAME,
                message = "Team name contains invalid characters."
        )
        String name,

        @NotNull(message = "Team type is required.")
        TeamType teamType,

        @NotBlank(message = "Season year is required.")
        @Pattern(
                regexp = ValidationPatterns.SEASON_YEAR,
                message = "Season year must be in format YYYY or YYYY/YYYY."
        )
        String seasonYear,

        @NotNull(message = "Active flag is required.")
        Boolean active,

        @NotNull(message = "Modality id is required.")
        Integer modalityId
) {
}