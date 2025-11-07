package com.example.clinic.genaiservice.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @PostMapping("/diagnosis/suggestions")
    public ResponseEntity<Map<String, Object>> getDiagnosisSuggestions(
            @Valid @RequestBody DiagnosisRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("suggestions", "AI-powered diagnostic suggestions based on symptoms: " + request.symptoms());
        response.put("confidence", 0.85);
        response.put("recommendedTests", new String[]{"Blood Test", "X-Ray"});
        response.put("message", "This is a placeholder response. Integrate with actual AI service for production.");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/treatment/recommendations")
    public ResponseEntity<Map<String, Object>> getTreatmentRecommendations(
            @Valid @RequestBody TreatmentRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("recommendations", "AI-generated treatment plan for: " + request.diagnosis());
        response.put("medications", new String[]{"Medication A", "Medication B"});
        response.put("duration", "2 weeks");
        response.put("message", "This is a placeholder response. Integrate with actual AI service for production.");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/documents/summarize")
    public ResponseEntity<Map<String, Object>> summarizeDocument(
            @Valid @RequestBody DocumentRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("summary", "AI-generated summary of the medical document");
        response.put("keyPoints", new String[]{"Point 1", "Point 2", "Point 3"});
        response.put("message", "This is a placeholder response. Integrate with actual AI service for production.");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "gen-ai-service");
        return ResponseEntity.ok(response);
    }

    // Request DTOs
    public record DiagnosisRequest(
            @NotBlank String symptoms,
            String patientHistory
    ) {}

    public record TreatmentRequest(
            @NotBlank String diagnosis,
            String patientId
    ) {}

    public record DocumentRequest(
            @NotBlank String documentText,
            String documentType
    ) {}
}

