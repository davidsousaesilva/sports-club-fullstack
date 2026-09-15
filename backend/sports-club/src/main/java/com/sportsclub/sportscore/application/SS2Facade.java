package com.sportsclub.sportscore.application;

import java.time.LocalDate;
import java.util.List;

import com.sportsclub.sportscore.dto.filter.ModalityFilter;
import com.sportsclub.sportscore.dto.request.CreateComplexRequest;
import com.sportsclub.sportscore.dto.request.CreateModalityRequest;
import com.sportsclub.sportscore.dto.request.CreateStatisticTypeRequest;
import com.sportsclub.sportscore.dto.request.UpdateComplexRequest;
import com.sportsclub.sportscore.dto.request.UpdateModalityRequest;
import com.sportsclub.sportscore.dto.request.UpdateStatisticTypeRequest;
import com.sportsclub.sportscore.dto.response.CalculatedPriceResponse;
import com.sportsclub.sportscore.dto.response.ComplexResponse;
import com.sportsclub.sportscore.dto.response.ModalityPriceResponse;
import com.sportsclub.sportscore.dto.response.ModalityResponse;
import com.sportsclub.sportscore.dto.response.ModalitySummaryResponse;
import com.sportsclub.sportscore.dto.response.StatisticTypeResponse;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;

public interface SS2Facade {

    List<ModalitySummaryResponse> listCoachModalities(Integer coachId);

    List<ModalityResponse> listModalities(ModalityFilter filter);

    ModalityResponse getModality(Integer modalityId);

    ModalityResponse createModality(CreateModalityRequest request, Integer performedBy);

    void updateModality(Integer modalityId, UpdateModalityRequest request, Integer performedBy);

    void deleteModality(Integer modalityId, Integer performedBy);

    List<StatisticTypeResponse> listStatisticTypesByModality(Integer modalityId);

    List<ModalityPriceResponse> listPricesByModality(Integer modalityId);

    CalculatedPriceResponse getRegistrationPrice(Integer modalityId, LocalDate birthDate);

    CalculatedPriceResponse getMonthlyFee(Integer modalityId, LocalDate birthDate);

    List<StatisticTypeResponse> listStatisticTypes();

    StatisticTypeResponse createStatisticType(CreateStatisticTypeRequest request, Integer performedBy);

    void updateStatisticType(Integer statisticTypeId, UpdateStatisticTypeRequest request, Integer performedBy);

    void deleteStatisticType(Integer statisticTypeId, Integer performedBy);

    List<ComplexResponse> listComplexes();

    ComplexResponse getComplex(Integer sportsComplexId);

    ComplexResponse createComplex(CreateComplexRequest request, Integer performedBy);

    void updateComplex(Integer sportsComplexId, UpdateComplexRequest request, Integer performedBy);

    void deleteComplex(Integer sportsComplexId, Integer performedBy);

    List<TeamSummaryResponse> getModalityTeams(Integer modalityId);
}