package com.sportsclub.sportscore.service;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.sportscore.domain.entities.ModalityPrice;
import com.sportsclub.sportscore.domain.entities.SportsComplex;
import com.sportsclub.sportscore.domain.entities.StatisticType;
import com.sportsclub.sportscore.dto.response.ComplexResponse;
import com.sportsclub.sportscore.dto.response.ModalityPriceResponse;
import com.sportsclub.sportscore.dto.response.ModalityResponse;
import com.sportsclub.sportscore.dto.response.ModalitySummaryResponse;
import com.sportsclub.sportscore.dto.response.StatisticTypeResponse;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;

@Component
public class SS2Mapper {

        public ModalityResponse toModalityResponse(Modality modality) {
                return toModalityResponse(modality, List.of());
        }

        public ModalityResponse toModalityResponse(
                        Modality modality,
                        List<TeamSummaryResponse> teams) {

                List<StatisticTypeResponse> statisticTypesResponse = modality.getStatisticTypeEntities().stream()
                                .map(this::toStatisticTypeResponse)
                                .toList();

                List<ModalityPriceResponse> pricesResponse = modality.getPrices().stream()
                                .map(this::toModalityPriceResponse)
                                .toList();

                return new ModalityResponse(
                        modality.getId(),
                        modality.getVersion(),
                        modality.getName(),
                        modality.getEventType(),
                        modality.getDescription(),
                        modality.isTrained(),
                        modality.getMaxPresencesPerWeek(),
                        statisticTypesResponse,
                        pricesResponse,
                        teams);
        }

        public StatisticTypeResponse toStatisticTypeResponse(StatisticType statisticType) {
                return new StatisticTypeResponse(
                        statisticType.getId(),
                        statisticType.getVersion(),
                        statisticType.getName(),
                        statisticType.getUnit(),
                        statisticType.isMandatory());
        }

        public ModalityPriceResponse toModalityPriceResponse(ModalityPrice price) {
                return new ModalityPriceResponse(
                                price.getId(),
                                price.getRegistrationFee(),
                                price.getMonthlyFee(),
                                price.getMinAge(),
                                price.getMaxAge(),
                                price.getModality() != null ? price.getModality().getId() : null);
        }

        public ComplexResponse toSportsComplexResponse(SportsComplex sportsComplex) {
                return new ComplexResponse(
                        sportsComplex.getId(),
                        sportsComplex.getVersion(),
                        sportsComplex.getName(),
                        sportsComplex.getAddress(),
                        sportsComplex.getPhone());
        }

        public ModalitySummaryResponse toModalitySummaryResponse(Modality modality) {
                return new ModalitySummaryResponse(
                                modality.getId(),
                                modality.getName(),
                                modality.getEventType(),
                                modality.getDescription(),
                                modality.isTrained(),
                                modality.getMaxPresencesPerWeek());
        }
}