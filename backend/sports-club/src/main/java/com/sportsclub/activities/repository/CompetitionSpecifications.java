package com.sportsclub.activities.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.sportsclub.activities.domain.entities.Competition;
import com.sportsclub.activities.domain.enums.TemporalStatus;
import com.sportsclub.teams.domain.enums.TeamRelation;

import jakarta.persistence.criteria.JoinType;

public final class CompetitionSpecifications {

    private CompetitionSpecifications() {
    }

    public static Specification<Competition> withFilters(
            Integer modalityId,
            TemporalStatus temporalStatus,
            String text) {
        return Specification.allOf(
                hasModalityId(modalityId),
                matchesTemporalStatus(temporalStatus),
                matchesText(text));
    }

    public static Specification<Competition> forAthlete(
            Integer athleteId,
            Integer modalityId,
            TemporalStatus temporalStatus,
            String text) {
        return Specification.allOf(
                withFilters(modalityId, temporalStatus, text),
                hasParticipantWithRelation(athleteId, TeamRelation.ATHLETE));
    }

    public static Specification<Competition> forCoach(
            Integer coachId,
            Integer modalityId,
            TemporalStatus temporalStatus,
            String text) {
        return Specification.allOf(
                withFilters(modalityId, temporalStatus, text),
                hasParticipantWithRelation(coachId, TeamRelation.COACH));
    }

    public static Specification<Competition> hasModalityId(Integer modalityId) {
        return (root, query, cb) -> modalityId == null ? null : cb.equal(root.get("modality").get("id"), modalityId);
    }

    public static Specification<Competition> matchesTemporalStatus(TemporalStatus temporalStatus) {
        return (root, query, cb) -> {
            if (temporalStatus == null) {
                return null;
            }

            LocalDate today = LocalDate.now();

            return switch (temporalStatus) {
                case FUTURE -> cb.greaterThan(root.get("startDate"), today);
                case PAST -> cb.and(
                        cb.isNotNull(root.get("endDate")),
                        cb.lessThan(root.get("endDate"), today));
                case IN_PROGRESS -> cb.and(
                        cb.lessThanOrEqualTo(root.get("startDate"), today),
                        cb.or(
                                cb.isNull(root.get("endDate")),
                                cb.greaterThanOrEqualTo(root.get("endDate"), today)));
            };
        };
    }

    public static Specification<Competition> matchesText(String text) {
        return (root, query, cb) -> {
            if (text == null || text.isBlank()) {
                return null;
            }

            String like = "%" + text.trim().toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.get("modality").get("name")), like));
        };
    }

    public static Specification<Competition> hasParticipantWithRelation(
            Integer personId,
            TeamRelation relation) {
        return (root, query, cb) -> {
            if (personId == null || relation == null) {
                return null;
            }

            query.distinct(true);

            var competitionTeam = root.join("competitionTeams", JoinType.INNER);
            var team = competitionTeam.join("team", JoinType.INNER);
            var member = team.join("members", JoinType.INNER);

            return cb.and(
                    cb.equal(member.get("person").get("id"), personId),
                    cb.equal(member.get("relationship"), relation),
                    cb.isNull(member.get("endDate")),
                    cb.isTrue(team.get("active"))
            );
        };
    }
}