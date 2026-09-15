package com.sportsclub.activities.application;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.sportsclub.activities.repository.CompetitionRepository;
import com.sportsclub.activities.repository.CompetitionSpecifications;
import com.sportsclub.activities.repository.EventRepository;
import com.sportsclub.activities.repository.EventSpecifications;
import com.sportsclub.activities.repository.TrainingRepository;
import com.sportsclub.activities.repository.TrainingSpecifications;
import com.sportsclub.security.user.AuthenticatedUser;

@Service("ss4AuthorizationService")
public class SS4AuthorizationService {

    private final CompetitionRepository competitionRepository;
    private final TrainingRepository trainingRepository;
    private final EventRepository eventRepository;

    public SS4AuthorizationService(
            CompetitionRepository competitionRepository,
            TrainingRepository trainingRepository,
            EventRepository eventRepository) {
        this.competitionRepository = competitionRepository;
        this.trainingRepository = trainingRepository;
        this.eventRepository = eventRepository;
    }

    public boolean canAccessCompetition(Authentication authentication, Integer competitionId) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            return false;
        }

        if (competitionId == null) {
            return false;
        }

        return competitionRepository.exists(
                CompetitionSpecifications.forAthlete(user.getPersonId(), null, null, null)
                        .and((root, query, cb) -> cb.equal(root.get("id"), competitionId)));
    }

    public boolean canAccessTrainingAsCoach(Authentication authentication, Integer trainingId) {
        Integer personId = extractPersonId(authentication);
        if (personId == null || trainingId == null) {
            return false;
        }

        return trainingRepository.exists(
                TrainingSpecifications.forCoach(personId, null, null, null, null)
                        .and((root, query, cb) -> cb.equal(root.get("id"), trainingId)));
    }

    public boolean canAccessTrainingAsAthlete(Authentication authentication, Integer trainingId) {
        Integer personId = extractPersonId(authentication);
        if (personId == null || trainingId == null) {
            return false;
        }

        return trainingRepository.exists(
                TrainingSpecifications.forAthlete(personId, null, null, null, null)
                        .and((root, query, cb) -> cb.equal(root.get("id"), trainingId)));
    }

    public boolean canAccessEventAsCoach(Authentication authentication, Integer eventId) {
        Integer personId = extractPersonId(authentication);
        if (personId == null || eventId == null) {
            return false;
        }

        return eventRepository.exists(
                EventSpecifications.forCoach(personId, null, null, null)
                        .and((root, query, cb) -> cb.equal(root.get("id"), eventId)));
    }

    public boolean canAccessEventAsAthlete(Authentication authentication, Integer eventId) {
        Integer personId = extractPersonId(authentication);
        if (personId == null || eventId == null) {
            return false;
        }

        return eventRepository.exists(
                EventSpecifications.forAthlete(personId, null, null, null)
                        .and((root, query, cb) -> cb.equal(root.get("id"), eventId)));
    }

    private Integer extractPersonId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            return null;
        }
        return user.getPersonId();
    }
}