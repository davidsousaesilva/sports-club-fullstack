package com.sportsclub.activities.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sportsclub.activities.domain.entities.Event;

public interface EventRepository
        extends JpaRepository<Event, Integer>, JpaSpecificationExecutor<Event> {

    List<Event> findByCompetitionIdOrderByDateAsc(Integer competitionId);

    long countByDateBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    long countByCompetitionId(Integer competitionId);

    @Query("""
            select t.name
            from EventTeam et
            join et.team t
            where et.event.id = :eventId
            order by t.name asc
            """)
    List<String> findTeamNamesByEventId(@Param("eventId") Integer eventId);
}