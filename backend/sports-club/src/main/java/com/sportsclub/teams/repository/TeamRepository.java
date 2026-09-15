package com.sportsclub.teams.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.sportsclub.teams.domain.entities.Team;

public interface TeamRepository extends JpaRepository<Team, Integer>, JpaSpecificationExecutor<Team> {

        boolean existsByNameIgnoreCaseAndSeasonYearAndModalityId(
                        String name,
                        String seasonYear,
                        Integer modalityId);

        boolean existsByNameIgnoreCaseAndSeasonYearAndModalityIdAndIdNot(
                        String name,
                        String seasonYear,
                        Integer modalityId,
                        Integer id);

        List<Team> findByMembersPersonId(Integer personId);

        long countByActiveTrue();

        List<Team> findByModalityIdOrderByNameAsc(Integer modalityId);

        @Query("""
        select t.modality.name, count(t)
        from Team t
        where t.active = true
        group by t.modality.name
        """)
        List<Object[]> countActiveTeamsByModality();
}