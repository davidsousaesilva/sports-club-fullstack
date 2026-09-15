package com.sportsclub.activities.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.activities.domain.entities.EventTeam;

public interface EventTeamRepository extends JpaRepository<EventTeam, Integer> {

    List<EventTeam> findByEventIdOrderByIdAsc(Integer eventId);

    Optional<EventTeam> findByEventIdAndTeamId(Integer eventId, Integer teamId);

    boolean existsByEventIdAndTeamId(Integer eventId, Integer teamId);

    void deleteByEventIdAndTeamId(Integer eventId, Integer teamId);
}