package com.sportsclub.activities.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sportsclub.activities.domain.entities.Training;

public interface TrainingRepository
                extends JpaRepository<Training, Integer>, JpaSpecificationExecutor<Training> {

        long countByDateBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}