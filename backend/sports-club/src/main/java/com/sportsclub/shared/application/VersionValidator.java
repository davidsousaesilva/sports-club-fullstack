package com.sportsclub.shared.application;

import org.springframework.stereotype.Component;

@Component
public class VersionValidator {

    public void validate(Long requestVersion, Long entityVersion) {
        if (requestVersion == null) {
            throw new IllegalArgumentException("Version is required.");
        }

        if (!requestVersion.equals(entityVersion)) {
            throw new IllegalStateException("Versão errada. Atualize a página e tente novamente.");
        }
    }
}