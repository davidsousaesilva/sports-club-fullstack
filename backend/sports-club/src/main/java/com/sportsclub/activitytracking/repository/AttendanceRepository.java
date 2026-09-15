package com.sportsclub.activitytracking.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.sportsclub.activitytracking.domain.entities.Attendance;
import com.sportsclub.teams.domain.enums.TeamRelation;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    List<Attendance> findByTrainingIdOrderByAthleteNameAsc(Integer trainingId);

    List<Attendance> findByEventIdOrderByAthleteNameAsc(Integer eventId);

    Optional<Attendance> findByAthleteIdAndTrainingId(Integer athleteId, Integer trainingId);

    Optional<Attendance> findByAthleteIdAndEventId(Integer athleteId, Integer eventId);

    long countByPresentTrue();

    long countByPresentFalse();

    long countByTrainingIsNotNullAndPresentTrue();

    long countByTrainingIsNotNullAndPresentFalse();

    long countByEventIsNotNullAndPresentTrue();

    long countByEventIsNotNullAndPresentFalse();

    long countByPresentTrueAndAthleteId(Integer athleteId);

    long countByPresentFalseAndAthleteId(Integer athleteId);

    long countByTrainingId(Integer trainingId);

    long countByTrainingIdAndPresentTrue(Integer trainingId);

    long countByEventIdAndPresentTrue(Integer eventId);

    @Query("""
            select a
            from Attendance a
            where a.team.id = :teamId
            and a.freeTraining = true
            and a.attendanceDate >= :weekStart
            and a.attendanceDate < :weekEnd
            order by a.athlete.name asc
            """)
    List<Attendance> findWeeklyFreeTrainingAttendances(
            @Param("teamId") Integer teamId,
            @Param("weekStart") LocalDate weekStart,
            @Param("weekEnd") LocalDate weekEnd);


    @Query("""
            select count(a)
            from Attendance a
            where a.present = :present
              and (
                    (
                        a.training is not null
                        and exists (
                            select 1
                            from TeamMember tm
                            where tm.team = a.training.team
                              and tm.person.id = :coachId
                              and tm.relationship = :relation
                        )
                    )
                    or
                    (
                        a.event is not null
                        and a.event.competition is not null
                        and exists (
                            select 1
                            from CompetitionTeam ct, TeamMember tm
                            where ct.competition = a.event.competition
                              and tm.team = ct.team
                              and tm.person.id = :coachId
                              and tm.relationship = :relation
                        )
                    )
              )
            """)
    long countByCoachAndPresent(
            @Param("coachId") Integer coachId,
            @Param("present") boolean present,
            @Param("relation") TeamRelation relation);

    List<Attendance> findTop10ByOrderByCreatedAtDesc();

    @Query("""
            select a
            from Attendance a
            where
                (
                    a.training is not null
                    and exists (
                        select 1
                        from TeamMember tm
                        where tm.team = a.training.team
                          and tm.person.id = :coachId
                          and tm.relationship = :relation
                    )
                )
                or
                (
                    a.event is not null
                    and a.event.competition is not null
                    and exists (
                        select 1
                        from CompetitionTeam ct, TeamMember tm
                        where ct.competition = a.event.competition
                          and tm.team = ct.team
                          and tm.person.id = :coachId
                          and tm.relationship = :relation
                    )
                )
            order by a.createdAt desc
            """)
    List<Attendance> findRecentAttendancesByCoach(
            @Param("coachId") Integer coachId,
            @Param("relation") TeamRelation relation,
            Pageable pageable);

    @Query("""
        select a.training.team.name,
            sum(case when a.present = true then 1 else 0 end),
            count(a)
        from Attendance a
        where a.training is not null
        group by a.training.team.name
    """)
    List<Object[]> attendanceCountByTeam();

    @Query("""
        select count(a)
        from Attendance a
        where a.athlete.id = :athleteId
        and a.team.id = :teamId
        and a.freeTraining = true
        and a.present = true
        and a.attendanceDate >= :weekStart
        and a.attendanceDate < :weekEnd
        """)
    long countWeeklyFreeTrainingAttendances(
            @Param("athleteId") Integer athleteId,
            @Param("teamId") Integer teamId,
            @Param("weekStart") LocalDate weekStart,
            @Param("weekEnd") LocalDate weekEnd);

    @Query("""
        select a
        from Attendance a
        where a.athlete.id = :athleteId
        and a.team.id = :teamId
        and a.freeTraining = true
        and a.attendanceDate = :attendanceDate
        """)
    Optional<Attendance> findFreeTrainingAttendanceForDay(
            @Param("athleteId") Integer athleteId,
            @Param("teamId") Integer teamId,
            @Param("attendanceDate") LocalDate attendanceDate);
}