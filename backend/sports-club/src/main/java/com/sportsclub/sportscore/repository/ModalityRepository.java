package com.sportsclub.sportscore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.sportsclub.sportscore.domain.entities.Modality;

public interface ModalityRepository extends JpaRepository<Modality, Integer>, JpaSpecificationExecutor<Modality> {

    List<Modality> findAllByOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);

    long countBy();

    @Query("""
            select distinct t.modality
            from Team t
            join t.members tm
            where tm.person.id = :coachId
            and tm.relationship = com.sportsclub.teams.domain.enums.TeamRelation.COACH
            and tm.endDate is null
            and t.active = true
            order by t.modality.name asc
            """)
    List<Modality> findActiveModalitiesByCoachId(Integer coachId);
}