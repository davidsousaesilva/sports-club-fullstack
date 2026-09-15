package com.sportsclub.activities.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.activities.domain.entities.CompetitionTeam;

public interface CompetitionTeamRepository extends JpaRepository<CompetitionTeam, Integer> {

    List<CompetitionTeam> findByCompetitionIdOrderByIdAsc(Integer competitionId);

    Optional<CompetitionTeam> findByCompetitionIdAndTeamId(Integer competitionId, Integer teamId);

    boolean existsByCompetitionIdAndTeamId(Integer competitionId, Integer teamId);

    void deleteByCompetitionIdAndTeamId(Integer competitionId, Integer teamId);

    long countByCompetitionId(Integer competitionId);
}