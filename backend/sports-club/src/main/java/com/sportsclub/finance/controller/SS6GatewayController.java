package com.sportsclub.finance.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sportsclub.finance.application.SS6Facade;
import com.sportsclub.finance.dto.request.GatewayNotificationRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/gateway")
public class SS6GatewayController {

    private final SS6Facade ss6Facade;

    public SS6GatewayController(SS6Facade ss6Facade) {
        this.ss6Facade = ss6Facade;
    }

    @PostMapping("/notifications")
    public ResponseEntity<Void> processGatewayNotification(@Valid @RequestBody GatewayNotificationRequest request) {
        ss6Facade.processGatewayNotification(request);
        return ResponseEntity.noContent().build();
    }
}