package com.sportsclub.sportscore.service;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import com.sportsclub.sportscore.domain.entities.StatisticType;
import com.sportsclub.sportscore.dto.request.StatisticTypeIdRequest;
import com.sportsclub.sportscore.repository.StatisticTypeRepository;

@Service
public class SS2ReferenceResolverService {

    private final StatisticTypeRepository statisticTypeRepository;

    public SS2ReferenceResolverService(StatisticTypeRepository statisticTypeRepository) {
        this.statisticTypeRepository = statisticTypeRepository;
    }

    public StatisticType getExistingStatisticType(Integer statisticTypeId) {
        return statisticTypeRepository.findById(statisticTypeId)
                .orElseThrow(() -> new EntityNotFoundException("Statistic type not found: " + statisticTypeId));
    }

    public List<StatisticType> getExistingStatisticTypes(List<StatisticTypeIdRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }

        return requests.stream()
                .map(StatisticTypeIdRequest::id)
                .distinct()
                .map(this::getExistingStatisticType)
                .toList();
    }
}