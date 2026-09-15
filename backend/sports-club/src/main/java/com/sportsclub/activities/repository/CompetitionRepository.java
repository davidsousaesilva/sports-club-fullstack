package com.sportsclub.activities.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sportsclub.activities.domain.entities.Competition;

public interface CompetitionRepository
                extends JpaRepository<Competition, Integer>, JpaSpecificationExecutor<Competition> {

        long countByEndDateIsNull();
}