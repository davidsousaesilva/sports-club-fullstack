package com.sportsclub.identity.service;

import org.springframework.stereotype.Service;

import com.sportsclub.identity.domain.valueobjects.PersonData;
import com.sportsclub.identity.dto.request.UpdatePersonRequest;

@Service
public class SS1FactoryService {

    public PersonData toPersonData(UpdatePersonRequest request) {
        return new PersonData(
                request.name(),
                request.gender(),
                request.email(),
                request.phone(),
                request.address(),
                request.birthDate(),
                request.entryDate(),
                request.active());
    }
}