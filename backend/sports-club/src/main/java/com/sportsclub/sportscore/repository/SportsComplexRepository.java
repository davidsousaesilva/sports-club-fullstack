package com.sportsclub.sportscore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.sportscore.domain.entities.SportsComplex;

public interface SportsComplexRepository extends JpaRepository<SportsComplex, Integer> {

    long countBy();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);
}