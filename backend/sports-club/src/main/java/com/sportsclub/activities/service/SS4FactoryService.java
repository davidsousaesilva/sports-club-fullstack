package com.sportsclub.activities.service;

import org.springframework.stereotype.Service;

import com.sportsclub.activities.domain.valueobjects.CompetitionData;
import com.sportsclub.activities.domain.valueobjects.EventData;
import com.sportsclub.activities.domain.valueobjects.TrainingData;
import com.sportsclub.activities.dto.request.CreateCompetitionRequest;
import com.sportsclub.activities.dto.request.CreateEventRequest;
import com.sportsclub.activities.dto.request.CreateTrainingRequest;
import com.sportsclub.activities.dto.request.UpdateCompetitionRequest;
import com.sportsclub.activities.dto.request.UpdateEventRequest;
import com.sportsclub.activities.dto.request.UpdateTrainingRequest;

@Service
public class SS4FactoryService {

    public CompetitionData toCompetitionData(CreateCompetitionRequest request) {
        return new CompetitionData(
                request.name(),
                request.description(),
                request.startDate(),
                request.endDate(),
                request.registrationFee());
    }

    public CompetitionData toCompetitionData(UpdateCompetitionRequest request) {
        return new CompetitionData(
                request.name(),
                request.description(),
                request.startDate(),
                request.endDate(),
                request.registrationFee());
    }

    public EventData toEventData(CreateEventRequest request) {
        return new EventData(
                request.description(),
                request.date(),
                request.duration());
    }

    public EventData toEventData(UpdateEventRequest request) {
        return new EventData(
                request.description(),
                request.date(),
                request.duration());
    }

    public TrainingData toTrainingData(CreateTrainingRequest request) {
        return new TrainingData(
                request.description(),
                request.note(),
                request.date(),
                request.duration());
    }

    public TrainingData toTrainingData(UpdateTrainingRequest request) {
        return new TrainingData(
                request.description(),
                request.note(),
                request.date(),
                request.duration());
    }
}