package com.sportsclub.sportscore.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sportsclub.sportscore.domain.entities.ModalityPrice;
import com.sportsclub.sportscore.domain.valueobjects.ModalityData;
import com.sportsclub.sportscore.domain.valueobjects.SportsComplexData;
import com.sportsclub.sportscore.domain.valueobjects.StatisticTypeData;
import com.sportsclub.sportscore.dto.request.CreateModalityRequest;
import com.sportsclub.sportscore.dto.request.ModalityPriceRequest;
import com.sportsclub.sportscore.dto.request.UpdateComplexRequest;
import com.sportsclub.sportscore.dto.request.UpdateModalityRequest;
import com.sportsclub.sportscore.dto.request.UpdateStatisticTypeRequest;

@Service
public class SS2FactoryService {

    public ModalityData toModalityData(CreateModalityRequest request) {
        return new ModalityData(
                request.name(),
                request.eventType(),
                request.description(),
                request.trained(),
                request.maxWeeklyAttendances());
    }

    public ModalityData toModalityData(UpdateModalityRequest request) {
        return new ModalityData(
                request.name(),
                request.eventType(),
                request.description(),
                request.trained(),
                request.maxWeeklyAttendances());
    }

    public StatisticTypeData toStatisticTypeData(UpdateStatisticTypeRequest request) {
        return new StatisticTypeData(
                request.name(),
                request.unit(),
                request.mandatory());
    }

    public SportsComplexData toSportsComplexData(UpdateComplexRequest request) {
        return new SportsComplexData(
                request.name(),
                request.address(),
                request.phone());
    }

    public List<ModalityPrice> toPriceEntities(List<ModalityPriceRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }

        return requests.stream()
                .map(request -> new ModalityPrice(
                        request.registrationFee(),
                        request.monthlyFee(),
                        request.ageRangeMin(),
                        request.ageRangeMax()))
                .toList();
    }
}