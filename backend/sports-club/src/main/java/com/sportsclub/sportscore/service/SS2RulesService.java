package com.sportsclub.sportscore.service;

import org.springframework.stereotype.Service;

import com.sportsclub.sportscore.repository.ModalityRepository;
import com.sportsclub.sportscore.repository.SportsComplexRepository;
import com.sportsclub.sportscore.repository.StatisticTypeRepository;

@Service
public class SS2RulesService {

    private final ModalityRepository modalityRepository;
    private final StatisticTypeRepository statisticTypeRepository;
    private final SportsComplexRepository sportsComplexRepository;

    public SS2RulesService(
            ModalityRepository modalityRepository,
            StatisticTypeRepository statisticTypeRepository,
            SportsComplexRepository sportsComplexRepository) {
        this.modalityRepository = modalityRepository;
        this.statisticTypeRepository = statisticTypeRepository;
        this.sportsComplexRepository = sportsComplexRepository;
    }

    public void validateUniqueModalityName(String name) {
        if (modalityRepository.existsByNameIgnoreCase(name.trim())) {
            throw new IllegalStateException("Modality name already exists.");
        }
    }

    public void validateUniqueModalityName(Integer modalityId, String name) {
        if (modalityRepository.existsByNameIgnoreCaseAndIdNot(name.trim(), modalityId)) {
            throw new IllegalStateException("Modality name already exists.");
        }
    }

    public void validateUniqueStatisticTypeName(String name) {
        if (statisticTypeRepository.existsByNameIgnoreCase(name.trim())) {
            throw new IllegalStateException("Statistic type name already exists.");
        }
    }

    public void validateUniqueStatisticTypeName(Integer statisticTypeId, String name) {
        if (statisticTypeRepository.existsByNameIgnoreCaseAndIdNot(name.trim(), statisticTypeId)) {
            throw new IllegalStateException("Statistic type name already exists.");
        }
    }

    public void validateUniqueSportsComplexName(String name) {
        if (sportsComplexRepository.existsByNameIgnoreCase(name.trim())) {
            throw new IllegalStateException("Sports complex name already exists.");
        }
    }

    public void validateUniqueSportsComplexName(Integer sportsComplexId, String name) {
        if (sportsComplexRepository.existsByNameIgnoreCaseAndIdNot(name.trim(), sportsComplexId)) {
            throw new IllegalStateException("Sports complex name already exists.");
        }
    }
}