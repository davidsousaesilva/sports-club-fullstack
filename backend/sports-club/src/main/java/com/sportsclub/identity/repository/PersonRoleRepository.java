package com.sportsclub.identity.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.identity.domain.entities.PersonRole;

public interface PersonRoleRepository extends JpaRepository<PersonRole, Integer> {

    List<PersonRole> findByPersonId(Integer personId);

    List<PersonRole> findByRoleAndStartDateBetween(
            com.sportsclub.identity.domain.enums.Role role,
            LocalDate start,
            LocalDate end);

    List<PersonRole> findByRoleAndEndDateIsNull(com.sportsclub.identity.domain.enums.Role role);
}