package com.sportsclub.activitytracking.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sportsclub.activitytracking.domain.entities.Performance;

public interface PerformanceRepository extends JpaRepository<Performance, Integer> {

        @Query("""
                        select p
                        from Performance p
                        where p.training.id = :trainingId
                        order by p.athlete.name asc, p.statisticType.name asc
                        """)
        List<Performance> findByTrainingIdOrdered(@Param("trainingId") Integer trainingId);

        @Query("""
                        select p
                        from Performance p
                        where p.event.id = :eventId
                        order by p.athlete.name asc, p.statisticType.name asc
                        """)
        List<Performance> findByEventIdOrdered(@Param("eventId") Integer eventId);

        Optional<Performance> findByAthleteIdAndStatisticTypeIdAndTrainingId(
                        Integer athleteId,
                        Integer statisticTypeId,
                        Integer trainingId);

        Optional<Performance> findByAthleteIdAndStatisticTypeIdAndEventId(
                        Integer athleteId,
                        Integer statisticTypeId,
                        Integer eventId);

        long countByTrainingIsNotNull();

        long countByEventIsNotNull();

        @Query("""
                select count(distinct p.athlete.id)
                from Performance p
                where p.training.id = :trainingId
                """)
        long countDistinctAthletesByTrainingId(@Param("trainingId") Integer trainingId);

        @Query("""
                select count(distinct p.athlete.id)
                from Performance p
                where p.event.id = :eventId
                """)
        long countDistinctAthletesByEventId(@Param("eventId") Integer eventId);

        @Query("""
                select coalesce(avg(p.value), 0)
                from Performance p
                where p.athlete.id = :personId
                and p.training is not null
                """)
        BigDecimal averageTrainingPerformanceByAthleteId(@Param("personId") Integer personId);

        @Query("""
                select coalesce(avg(p.value), 0)
                from Performance p
                where p.athlete.id = :personId
                and p.event is not null
                """)
        BigDecimal averageEventPerformanceByAthleteId(@Param("personId") Integer personId);

        long countByAthleteIdAndTrainingIsNotNull(Integer athleteId);

        long countByAthleteIdAndEventIsNotNull(Integer athleteId);
}