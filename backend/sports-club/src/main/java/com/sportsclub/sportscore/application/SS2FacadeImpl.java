package com.sportsclub.sportscore.application;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.repository.PersonRepository;
import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.sportscore.domain.entities.SportsComplex;
import com.sportsclub.sportscore.domain.entities.StatisticType;
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
import com.sportsclub.sportscore.repository.ModalityRepository;
import com.sportsclub.sportscore.repository.ModalitySpecifications;
import com.sportsclub.sportscore.repository.SportsComplexRepository;
import com.sportsclub.sportscore.repository.StatisticTypeRepository;
import com.sportsclub.sportscore.service.SS2FactoryService;
import com.sportsclub.sportscore.service.SS2Mapper;
import com.sportsclub.sportscore.service.SS2ReferenceResolverService;
import com.sportsclub.sportscore.service.SS2RulesService;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;
import com.sportsclub.teams.repository.TeamRepository;
import com.sportsclub.teams.service.SS3Mapper;
import com.sportsclub.shared.application.VersionValidator;

@Service
@Transactional
public class SS2FacadeImpl implements SS2Facade {

    private final ModalityRepository modalityRepository;
    private final StatisticTypeRepository statisticTypeRepository;
    private final SportsComplexRepository sportsComplexRepository;
    private final PersonRepository personRepository;
    private final SS2Mapper ss2Mapper;
    private final SS2RulesService ss2RulesService;
    private final SS2FactoryService ss2FactoryService;
    private final SS2ReferenceResolverService ss2ReferenceResolverService;
    private final EntityManager entityManager;
    private final TeamRepository teamRepository;
    private final SS3Mapper ss3Mapper;
    private final VersionValidator versionValidator;

    public SS2FacadeImpl(
            ModalityRepository modalityRepository,
            StatisticTypeRepository statisticTypeRepository,
            SportsComplexRepository sportsComplexRepository,
            PersonRepository personRepository,
            SS2Mapper ss2Mapper,
            SS2RulesService ss2RulesService,
            SS2FactoryService ss2FactoryService,
            SS2ReferenceResolverService ss2ReferenceResolverService,
            EntityManager entityManager,
            TeamRepository teamRepository,
            SS3Mapper ss3Mapper,
            VersionValidator versionValidator) {
        this.modalityRepository = modalityRepository;
        this.statisticTypeRepository = statisticTypeRepository;
        this.sportsComplexRepository = sportsComplexRepository;
        this.personRepository = personRepository;
        this.ss2Mapper = ss2Mapper;
        this.ss2RulesService = ss2RulesService;
        this.ss2FactoryService = ss2FactoryService;
        this.ss2ReferenceResolverService = ss2ReferenceResolverService;
        this.entityManager = entityManager;
        this.teamRepository = teamRepository;
        this.ss3Mapper = ss3Mapper;
        this.versionValidator = versionValidator;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModalitySummaryResponse> listCoachModalities(Integer coachId) {
        return modalityRepository.findActiveModalitiesByCoachId(coachId).stream()
                .map(ss2Mapper::toModalitySummaryResponse)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ModalityResponse> listModalities(ModalityFilter filter) {
        return modalityRepository.findAll(ModalitySpecifications.withFilter(filter)).stream()
                .map(ss2Mapper::toModalityResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ModalityResponse getModality(Integer modalityId) {
        Modality modality = getExistingModality(modalityId);

        List<TeamSummaryResponse> teams = teamRepository
                .findByModalityIdOrderByNameAsc(modalityId)
                .stream()
                .map(ss3Mapper::toTeamSummaryResponse)
                .toList();

        return ss2Mapper.toModalityResponse(modality, teams);
    }

    @Override
    public ModalityResponse createModality(CreateModalityRequest request, Integer performedBy) {
        ss2RulesService.validateUniqueModalityName(request.name());

        Person actor = getExistingPerson(performedBy);

        Modality modality = new Modality(
                request.name(),
                request.eventType(),
                request.description(),
                request.trained(),
                request.maxWeeklyAttendances());

        Modality saved = modalityRepository.save(modality);

        saved.replaceStatisticTypes(
                ss2ReferenceResolverService.getExistingStatisticTypes(request.statisticTypes()),
                actor);

        saved.replacePrices(
                ss2FactoryService.toPriceEntities(request.prices()),
                actor);

        return ss2Mapper.toModalityResponse(saved);
    }

    @Override
    public void updateModality(Integer modalityId, UpdateModalityRequest request, Integer performedBy) {
        Modality modality = getExistingModality(modalityId);
        Person actor = getExistingPerson(performedBy);

        versionValidator.validate(request.version(), modality.getVersion());

        ss2RulesService.validateUniqueModalityName(modalityId, request.name());

        modality.update(
                ss2FactoryService.toModalityData(request),
                actor);

        modality.replaceStatisticTypes(List.of(), actor);
        modality.replacePrices(List.of(), actor);

        entityManager.flush();
        entityManager.clear();

        modality = getExistingModality(modalityId);
        actor = getExistingPerson(performedBy);

        modality.replaceStatisticTypes(
                ss2ReferenceResolverService.getExistingStatisticTypes(request.statisticTypes()),
                actor);

        modality.replacePrices(
                ss2FactoryService.toPriceEntities(request.prices()),
                actor);
    }

    @Override
    public void deleteModality(Integer modalityId, Integer performedBy) {
        Modality modality = getExistingModality(modalityId);
        modalityRepository.delete(modality);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatisticTypeResponse> listStatisticTypesByModality(Integer modalityId) {
        Modality modality = getExistingModality(modalityId);
        return modality.getStatisticTypeEntities().stream()
                .map(ss2Mapper::toStatisticTypeResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModalityPriceResponse> listPricesByModality(Integer modalityId) {
        Modality modality = getExistingModality(modalityId);
        return modality.getPrices().stream()
                .map(ss2Mapper::toModalityPriceResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CalculatedPriceResponse getRegistrationPrice(Integer modalityId, LocalDate birthDate) {
        Modality modality = getExistingModality(modalityId);
        return new CalculatedPriceResponse(modality.getRegistrationPriceFor(birthDate));
    }

    @Override
    @Transactional(readOnly = true)
    public CalculatedPriceResponse getMonthlyFee(Integer modalityId, LocalDate birthDate) {
        Modality modality = getExistingModality(modalityId);
        return new CalculatedPriceResponse(modality.getMonthlyFeeFor(birthDate));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatisticTypeResponse> listStatisticTypes() {
        return statisticTypeRepository.findAll().stream()
                .map(ss2Mapper::toStatisticTypeResponse)
                .toList();
    }

    @Override
    public StatisticTypeResponse createStatisticType(CreateStatisticTypeRequest request, Integer performedBy) {
        ss2RulesService.validateUniqueStatisticTypeName(request.name());

        Person actor = getExistingPerson(performedBy);

        StatisticType statisticType = new StatisticType(
                request.name(),
                request.unit(),
                request.mandatory());

        statisticType.touch(actor);

        StatisticType saved = statisticTypeRepository.save(statisticType);
        return ss2Mapper.toStatisticTypeResponse(saved);
    }

    @Override
    public void updateStatisticType(Integer statisticTypeId, UpdateStatisticTypeRequest request, Integer performedBy) {
        StatisticType statisticType = getExistingStatisticType(statisticTypeId);
        Person actor = getExistingPerson(performedBy);

        versionValidator.validate(request.version(), statisticType.getVersion());

        ss2RulesService.validateUniqueStatisticTypeName(statisticTypeId, request.name());

        statisticType.update(
                ss2FactoryService.toStatisticTypeData(request),
                actor);
    }

    @Override
    public void deleteStatisticType(Integer statisticTypeId, Integer performedBy) {
        StatisticType statisticType = getExistingStatisticType(statisticTypeId);
        statisticTypeRepository.delete(statisticType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplexResponse> listComplexes() {
        return sportsComplexRepository.findAll().stream()
                .map(ss2Mapper::toSportsComplexResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ComplexResponse getComplex(Integer sportsComplexId) {
        SportsComplex sportsComplex = getExistingSportsComplex(sportsComplexId);
        return ss2Mapper.toSportsComplexResponse(sportsComplex);
    }

    @Override
    public ComplexResponse createComplex(CreateComplexRequest request, Integer performedBy) {
        ss2RulesService.validateUniqueSportsComplexName(request.name());

        Person actor = getExistingPerson(performedBy);

        SportsComplex sportsComplex = new SportsComplex(
                request.name(),
                request.address(),
                request.phone());
        sportsComplex.touch(actor);

        SportsComplex saved = sportsComplexRepository.save(sportsComplex);
        return ss2Mapper.toSportsComplexResponse(saved);
    }

    @Override
    public void updateComplex(Integer sportsComplexId, UpdateComplexRequest request, Integer performedBy) {
        SportsComplex sportsComplex = getExistingSportsComplex(sportsComplexId);
        Person actor = getExistingPerson(performedBy);

        versionValidator.validate(request.version(), sportsComplex.getVersion());

        ss2RulesService.validateUniqueSportsComplexName(sportsComplexId, request.name());

        sportsComplex.update(
                ss2FactoryService.toSportsComplexData(request),
                actor);
    }

    @Override
    public void deleteComplex(Integer sportsComplexId, Integer performedBy) {
        SportsComplex sportsComplex = getExistingSportsComplex(sportsComplexId);
        sportsComplexRepository.delete(sportsComplex);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamSummaryResponse> getModalityTeams(Integer modalityId) {
        getExistingModality(modalityId);

        return teamRepository.findByModalityIdOrderByNameAsc(modalityId)
                .stream()
                .map(ss3Mapper::toTeamSummaryResponse)
                .toList();
    }

    private Modality getExistingModality(Integer modalityId) {
        return modalityRepository.findById(modalityId)
                .orElseThrow(() -> new EntityNotFoundException("Modality not found: " + modalityId));
    }

    private StatisticType getExistingStatisticType(Integer statisticTypeId) {
        return statisticTypeRepository.findById(statisticTypeId)
                .orElseThrow(() -> new EntityNotFoundException("Statistic type not found: " + statisticTypeId));
    }

    private SportsComplex getExistingSportsComplex(Integer sportsComplexId) {
        return sportsComplexRepository.findById(sportsComplexId)
                .orElseThrow(() -> new EntityNotFoundException("Sports complex not found: " + sportsComplexId));
    }

    private Person getExistingPerson(Integer personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException("Person not found: " + personId));
    }
}