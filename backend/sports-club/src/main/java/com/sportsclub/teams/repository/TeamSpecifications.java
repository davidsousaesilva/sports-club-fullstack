package com.sportsclub.teams.repository;

import org.springframework.data.jpa.domain.Specification;

import com.sportsclub.teams.domain.entities.Team;
import com.sportsclub.teams.domain.enums.TeamRelation;
import com.sportsclub.teams.dto.filter.TeamFilter;

public final class TeamSpecifications {

    private TeamSpecifications() {
    }

    public static Specification<Team> withFilter(TeamFilter filter) {
        if (filter == null) {
            return Specification.where(null);
        }

        return (root, query, cb) -> {
            query.distinct(true);

            var predicates = cb.conjunction();

            if (filter.modalityId() != null) {
                predicates = cb.and(
                        predicates,
                        cb.equal(root.get("modality").get("id"), filter.modalityId()));
            }

            if (filter.teamType() != null) {
                predicates = cb.and(
                        predicates,
                        cb.equal(root.get("teamType"), filter.teamType()));
            }

            if (filter.active() != null) {
                predicates = cb.and(
                        predicates,
                        cb.equal(root.get("active"), filter.active()));
            }

            if (filter.freeTrainingEligible() != null) {
                if (Boolean.TRUE.equals(filter.freeTrainingEligible())) {
                    predicates = cb.and(
                            predicates,
                            cb.isFalse(root.get("modality").get("trained")));
                } else {
                    predicates = cb.and(
                            predicates,
                            cb.isTrue(root.get("modality").get("trained")));
                }
            }


            if (filter.teamOrModalityName() != null && !filter.teamOrModalityName().isBlank()) {
                String term = "%" + filter.teamOrModalityName().trim().toLowerCase() + "%";

                predicates = cb.and(
                        predicates,
                        cb.or(
                                cb.like(cb.lower(root.get("name")), term),
                                cb.like(cb.lower(root.get("modality").get("name")), term)));
            }

            return predicates;
        };
    }

    public static Specification<Team> withCoachAndFilter(Integer coachId, TeamFilter filter) {
        return byMemberAndRelation(coachId, TeamRelation.COACH).and(withFilter(filter));
    }

    public static Specification<Team> withAthleteAndFilter(Integer athleteId, TeamFilter filter) {
        return byMemberAndRelation(athleteId, TeamRelation.ATHLETE).and(withFilter(filter));
    }

    private static Specification<Team> byMemberAndRelation(Integer personId, TeamRelation relation) {
        return (root, query, cb) -> {
            if (personId == null || relation == null) {
                return null;
            }

            query.distinct(true);

            var memberJoin = root.join("members");

            return cb.and(
                    cb.equal(memberJoin.get("person").get("id"), personId),
                    cb.equal(memberJoin.get("relationship"), relation),
                    cb.isNull(memberJoin.get("endDate")),
                    cb.isTrue(root.get("active"))
            );
        };
    }
}