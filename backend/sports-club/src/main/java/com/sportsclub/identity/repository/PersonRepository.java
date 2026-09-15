package com.sportsclub.identity.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sportsclub.identity.domain.entities.Person;

public interface PersonRepository extends JpaRepository<Person, Integer>, JpaSpecificationExecutor<Person> {

    Optional<Person> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Integer id);

    long countByActiveTrue();

    long countByActiveTrueAndEntryDateBetween(java.time.LocalDate start, java.time.LocalDate end);

    List<Person> findByBirthDateNotNull();
}