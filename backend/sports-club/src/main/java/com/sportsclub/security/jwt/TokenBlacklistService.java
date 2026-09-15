package com.sportsclub.security.jwt;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistService {

    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    public void blacklistToken(String jti, long tokenLifetimeMs) {
        long expirationTimestamp = Instant.now().toEpochMilli() + tokenLifetimeMs;
        blacklist.put(jti, expirationTimestamp);
    }

    public boolean isBlacklisted(String jti) {
        Long expirationTimestamp = blacklist.get(jti);

        if (expirationTimestamp == null) {
            return false;
        }

        if (Instant.now().toEpochMilli() > expirationTimestamp) {
            blacklist.remove(jti);
            return false;
        }

        return true;
    }

    @Scheduled(fixedDelay = 60000)
    public void cleanupExpiredTokens() {
        long now = Instant.now().toEpochMilli();
        blacklist.entrySet().removeIf(entry -> entry.getValue() < now);
    }
}