package com.sportsclub.sportscore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.sportscore.domain.entities.ModalityStatisticType;
import com.sportsclub.sportscore.domain.entities.ModalityStatisticTypeId;

public interface ModalityStatisticTypeRepository extends JpaRepository<ModalityStatisticType, ModalityStatisticTypeId> {

    List<ModalityStatisticType> findByModality_Id(Integer modalityId);
}