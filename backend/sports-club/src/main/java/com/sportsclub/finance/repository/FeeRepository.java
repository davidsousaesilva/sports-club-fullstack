package com.sportsclub.finance.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sportsclub.finance.domain.entities.Fee;
import com.sportsclub.finance.domain.enums.FeeStatus;
import com.sportsclub.finance.domain.enums.FeeType;

public interface FeeRepository extends JpaRepository<Fee, Integer>, JpaSpecificationExecutor<Fee> {

        List<Fee> findByAthleteIdOrderByDueDateDesc(Integer athleteId);

        List<Fee> findByAthleteIdAndStatusOrderByDueDateDesc(Integer athleteId, FeeStatus status);

        boolean existsByAthleteIdAndStatus(Integer athleteId, FeeStatus status);

        long countByStatus(FeeStatus status);

        long countByStatusAndDueDateBetween(
                FeeStatus status,
                LocalDateTime start,
                LocalDateTime end);

        long countByType(FeeType type);

        boolean existsByAthleteIdAndTeamIdAndType(
                Integer athleteId,
                Integer teamId,
                FeeType type);

        boolean existsByAthleteIdAndCompetitionTeamOriginIdAndType(
                Integer athleteId,
                Integer competitionTeamOriginId,
                        FeeType type);
                
        List<Fee> findByRecurrentTrueAndTypeAndNextCycleLessThanEqual(
                FeeType type,
                        LocalDateTime nextCycle);
                
        boolean existsByAthleteIdAndTeamIdAndTypeAndDueDateBetween(
                Integer athleteId,
                Integer teamId,
                FeeType type,
                LocalDateTime start,
                LocalDateTime end);

        @Query("""
                select coalesce(sum(f.amount), 0)
                from Fee f
                where f.status in :statuses
                and f.dueDate >= :start
                and f.dueDate < :end
        """)
        BigDecimal sumAmountByStatusInAndDueDateBetween(
                @Param("statuses") List<FeeStatus> statuses,
                @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);
            
        @Query("""
        select coalesce(sum(f.amount), 0)
        from Fee f
        where f.status in :statuses
        """)
        BigDecimal sumAmountByStatusIn(@Param("statuses") List<FeeStatus> statuses);

        @Query("""
        select count(f)
        from Fee f
        where f.status = :status
        """)
        long countFeesByStatus(@Param("status") FeeStatus status);

        @Query("""
        select count(f)
        from Fee f
        where f.type = :type
        """)
        long countFeesByType(@Param("type") FeeType type);

        @Query("""
        select coalesce(avg(f.amount), 0)
        from Fee f
        where f.type = :type
        """)
        BigDecimal averageAmountByType(@Param("type") FeeType type);

        @Query("""
        select coalesce(sum(f.amount), 0)
        from Fee f
        where f.status = :status
        """)
        BigDecimal sumAmountByStatus(@Param("status") FeeStatus status);
}