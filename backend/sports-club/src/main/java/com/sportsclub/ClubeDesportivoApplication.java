package com.sportsclub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.sportsclub")
@EnableJpaRepositories(basePackages = "com.sportsclub")
@EnableScheduling
public class ClubeDesportivoApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClubeDesportivoApplication.class, args);
    }
}