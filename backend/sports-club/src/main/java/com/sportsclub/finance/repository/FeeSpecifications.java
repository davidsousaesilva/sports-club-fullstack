package com.sportsclub.finance.repository;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import com.sportsclub.finance.domain.entities.Fee;
import com.sportsclub.finance.domain.enums.FeeStatus;
import com.sportsclub.finance.dto.filter.FeeFilterQuery;

public class FeeSpecifications {

    public static Specification<Fee> withFilter(FeeFilterQuery filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.status() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.status()));
            }

            if (filter.type() != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), filter.type()));
            }

            if (filter.athleteOrTeamName() != null && !filter.athleteOrTeamName().isBlank()) {
                String searchTerm = "%" + filter.athleteOrTeamName().toLowerCase() + "%";
                Predicate athleteMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("athlete").get("name")), searchTerm);
                Predicate teamMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("team").get("name")), searchTerm);
                predicates.add(criteriaBuilder.or(athleteMatch, teamMatch));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Fee> athleteActiveFees(Integer athleteId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.equal(root.get("athlete").get("id"), athleteId),
                criteriaBuilder.notEqual(root.get("status"), FeeStatus.DEBT));
    }

    public static Specification<Fee> onlyDebts() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), FeeStatus.DEBT);
    }
}