package com.sportsclub.sportscore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.sportscore.domain.entities.StatisticType;

public interface StatisticTypeRepository extends JpaRepository<StatisticType, Integer> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);

    long countBy();

    Optional<StatisticType> findByNameIgnoreCase(String name);
}