package com.sportsclub.sportscore.repository;

import org.springframework.data.jpa.domain.Specification;

import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.sportscore.dto.filter.ModalityFilter;

public final class ModalitySpecifications {

    private ModalitySpecifications() {
    }

    public static Specification<Modality> withFilter(ModalityFilter filter) {
        if (filter == null) {
            return Specification.where(null);
        }

        return (root, query, cb) -> {
            query.distinct(true);

            var predicates = cb.conjunction();

            if (filter.trained() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trained"), filter.trained()));
            }

            if (filter.modalityNameOrDescription() != null && !filter.modalityNameOrDescription().isBlank()) {
                String term = "%" + filter.modalityNameOrDescription().trim().toLowerCase() + "%";
                predicates = cb.and(
                        predicates,
                        cb.or(
                                cb.like(cb.lower(root.get("name")), term),
                                cb.like(cb.lower(root.get("description")), term)));
            }

            return predicates;
        };
    }
}