package com.sportsclub.bootstrap;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.entities.PersonRole;
import com.sportsclub.identity.domain.enums.Gender;
import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.identity.repository.PersonRepository;

import jakarta.transaction.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public DataInitializer(
            PersonRepository personRepository,
            PasswordEncoder passwordEncoder) {
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void run(String... args) {

        if (personRepository.findByEmailIgnoreCase(adminEmail).isEmpty()) {

            Person manager = new Person(
                    "Admin",
                    Gender.MALE,
                    adminEmail,
                    "910000000",
                    "Porto",
                    LocalDate.of(2000, 1, 1),
                    LocalDate.now(),
                    true);

            manager.setPasswordHash(
                    passwordEncoder.encode(adminPassword));

            PersonRole role = new PersonRole(
                    Role.MANAGER,
                    LocalDate.now(),
                    null,
                    true,
                    null,
                    manager);

            manager.addRole(role);

            personRepository.save(manager);
        }
    }
}
