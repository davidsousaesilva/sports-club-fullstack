package com.sportsclub.identity.repository;

import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.dto.filter.PersonFilter;

public final class PersonSpecifications {

    private PersonSpecifications() {
    }

    public static Specification<Person> withFilter(PersonFilter filter) {
        if (filter == null) {
            return Specification.where(null);
        }

        return (root, query, cb) -> {
            query.distinct(true);

            var predicates = cb.conjunction();

            if (filter.active() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("active"), filter.active()));
            }

            if (filter.personNameOrEmail() != null && !filter.personNameOrEmail().isBlank()) {
                String term = "%" + filter.personNameOrEmail().trim().toLowerCase() + "%";
                predicates = cb.and(
                        predicates,
                        cb.or(
                                cb.like(cb.lower(root.get("name")), term),
                                cb.like(cb.lower(root.get("email")), term)));
            }

            if (filter.role() != null) {
                var roleJoin = root.join("roles");
                LocalDate today = LocalDate.now();

                predicates = cb.and(
                        predicates,
                        cb.equal(roleJoin.get("role"), filter.role()),
                        cb.lessThanOrEqualTo(roleJoin.get("startDate"), today),
                        cb.isNull(roleJoin.get("endDate")));
            }

            return predicates;
        };
    }
}