package com.example.clinic.visitservice.controller;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import com.example.clinic.visitservice.model.Visit;
import com.example.clinic.visitservice.model.VisitRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * REST Controller for Visits connected to Patients.
 */
@RestController
@RequestMapping("/visits")
@Timed("clinic.visit")
class VisitResource {

    private static final Logger log = LoggerFactory.getLogger(VisitResource.class);

    private final VisitRepository visitRepository;

    VisitResource(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    /**
     * Create a new visit for a patient.
     */
    @PostMapping("/patients/{patientId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Visit create(
        @Valid @RequestBody Visit visit,
        @PathVariable("patientId") @Min(1) int patientId) {

        visit.setPatientId(patientId);
        log.info("Saving visit for patient {} -> {}", patientId, visit);
        return visitRepository.save(visit);
    }

    @GetMapping
        public List<Visit> readAll() {
        return visitRepository.findAll();
    }
    /**
     * Get all visits for a single patient.
     */
    @GetMapping("patients/{patientId}")
    public List<Visit> read(@PathVariable("patientId") @Min(1) int patientId) {
        return visitRepository.findByPatientId(patientId);
    }

    /**
     * Get visits for multiple patients.
     */
    @GetMapping("patients")
    public Visits read(@RequestParam("patientId") List<Integer> patientIds) {
        final List<Visit> byPatientIdIn = visitRepository.findByPatientIdIn(patientIds);
        return new Visits(byPatientIdIn);
    }

    /**
     * Wrapper record to return a list of visits.
     */
    record Visits(
        List<Visit> items
    ) {
    }
}
