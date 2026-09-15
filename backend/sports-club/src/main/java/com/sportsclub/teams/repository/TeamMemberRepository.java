package com.sportsclub.teams.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.sportsclub.teams.domain.entities.TeamMember;
import com.sportsclub.teams.domain.enums.TeamRelation;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {

    Optional<TeamMember> findFirstByTeamIdAndPersonIdAndRelationshipAndEndDateIsNull(
            Integer teamId,
            Integer personId,
            TeamRelation relationship);

    boolean existsByTeamIdAndPersonIdAndRelationshipAndEndDateIsNull(
            Integer teamId,
            Integer personId,
            TeamRelation relationship);

    @Query("""
                select tm
                from TeamMember tm
                where tm.team.id = :teamId
                  and tm.relationship = :relationship
                  and tm.startDate <= :at
                  and (tm.endDate is null or tm.endDate >= :at)
                order by tm.startDate desc
            """)
    List<TeamMember> findActiveMembersAt(       
            Integer teamId,
            TeamRelation relationship,
            LocalDateTime at);

    @Query("""
                select distinct tm.team
                from TeamMember tm
                where tm.person.id = :personId
                  and tm.relationship = :relationship
            """)
    List<com.sportsclub.teams.domain.entities.Team> findTeamsByPersonAndRelation(
            Integer personId,
            TeamRelation relationship);

    @Query("""
                select (count(tm) > 0)
                from TeamMember tm
                where tm.team.id = :teamId
                  and tm.person.id = :personId
                  and tm.relationship in :relations
                  and tm.startDate <= :at
                  and (tm.endDate is null or tm.endDate >= :at)
            """)
    boolean existsActiveMembershipAt(
            Integer teamId,
            Integer personId,
            List<TeamRelation> relations,
            LocalDateTime at);

    @Query("""
                select (count(tm) > 0)
                from TeamMember tm
                where tm.team.id = :teamId
                  and tm.person.id = :personId
                  and tm.relationship = :relation
                  and tm.startDate <= :at
                  and (tm.endDate is null or tm.endDate >= :at)
            """)
    boolean existsActiveMembershipAt(
            Integer teamId,
            Integer personId,
            TeamRelation relation,
            LocalDateTime at);

    long countByRelationshipAndEndDateIsNull(TeamRelation relationship);

    @Query("""
        select tm.team.modality.name, count(distinct tm.person.id)
        from TeamMember tm
        where tm.relationship = com.sportsclub.teams.domain.enums.TeamRelation.ATHLETE
        and tm.endDate is null
        and tm.team.active = true
        group by tm.team.modality.name
        """)
        List<Object[]> countActiveAthletesByModality();
}