package com.sportsclub.activities.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.Specification;

import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.enums.TemporalStatus;
import com.sportsclub.teams.domain.enums.TeamRelation;

import jakarta.persistence.criteria.JoinType;

public final class EventSpecifications {

    private EventSpecifications() {
    }

    public static Specification<Event> withFilters(
            Integer competitionId,
            TemporalStatus temporalStatus,
            String eventNameOrDescriptionOrCompetition) {

        return Specification.allOf(
                byCompetition(competitionId),
                matchesEventNameOrDescriptionOrCompetition(eventNameOrDescriptionOrCompetition));
    }

    public static Specification<Event> byCompetition(Integer competitionId) {
        return (root, query, cb) -> competitionId == null ? null
                : cb.equal(root.get("competition").get("id"), competitionId);
    }

    public static Specification<Event> matchesEventNameOrDescriptionOrCompetition(
            String eventNameOrDescriptionOrCompetition) {

        return (root, query, cb) -> {
            if (eventNameOrDescriptionOrCompetition == null
                    || eventNameOrDescriptionOrCompetition.isBlank()) {
                return null;
            }

            String term = "%" + eventNameOrDescriptionOrCompetition.trim().toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("description")), term),
                    cb.like(cb.lower(root.join("competition", JoinType.LEFT).get("name")), term),
                    cb.like(cb.lower(root.join("modality", JoinType.LEFT).get("name")), term));
        };
    }

    public static Specification<Event> forAthlete(
            Integer athleteId,
            Integer competitionId,
            TemporalStatus temporalStatus,
            String eventNameOrDescriptionOrCompetition) {

        return Specification.allOf(
                withFilters(
                        competitionId,
                        temporalStatus,
                        eventNameOrDescriptionOrCompetition),
                hasParticipantWithRelation(athleteId, TeamRelation.ATHLETE));
    }

    public static Specification<Event> forCoach(
            Integer coachId,
            Integer competitionId,
            TemporalStatus temporalStatus,
            String eventNameOrDescriptionOrCompetition) {

        return Specification.allOf(
                withFilters(
                        competitionId,
                        temporalStatus,
                        eventNameOrDescriptionOrCompetition),
                hasParticipantWithRelation(coachId, TeamRelation.COACH));
    }

    public static Specification<Event> matchesTemporalStatus(TemporalStatus temporalStatus) {
        return (root, query, cb) -> {
            if (temporalStatus == null) {
                return null;
            }

            LocalDateTime now = LocalDateTime.now();

            return switch (temporalStatus) {
                case FUTURE -> cb.greaterThan(root.get("date"), now);

                case PAST -> cb.lessThan(
                        cb.function("timestampadd", LocalDateTime.class,
                                cb.literal("MINUTE"),
                                root.get("duration"),
                                root.get("date")),
                        now);

                case IN_PROGRESS -> cb.and(
                        cb.lessThanOrEqualTo(root.get("date"), now),
                        cb.greaterThan(
                                cb.function("timestampadd", LocalDateTime.class,
                                        cb.literal("MINUTE"),
                                        root.get("duration"),
                                        root.get("date")),
                                now));
            };
        };
    }

    public static Specification<Event> hasParticipantWithRelation(
        Integer personId,
                    TeamRelation relation) {
            return (root, query, cb) -> {
                    if (personId == null || relation == null) {
                            return null;
                    }

                    query.distinct(true);

                    var eventTeam = root.join("eventTeams", JoinType.INNER);
                    var team = eventTeam.join("team", JoinType.INNER);
                    var member = team.join("members", JoinType.INNER);

                    return cb.and(
                                    cb.equal(member.get("person").get("id"), personId),
                                    cb.equal(member.get("relationship"), relation),
                                    cb.isNull(member.get("endDate")),
                                    cb.isTrue(team.get("active")));
            };
    }

}