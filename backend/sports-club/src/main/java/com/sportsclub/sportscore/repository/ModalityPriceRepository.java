package com.sportsclub.sportscore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsclub.sportscore.domain.entities.ModalityPrice;

public interface ModalityPriceRepository extends JpaRepository<ModalityPrice, Integer> {

    List<ModalityPrice> findByModality_IdOrderByMinAgeAsc(Integer modalityId);
}