/*
 * Copyright 2002-2021 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.clinic.patientservice.controller;

import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import com.example.clinic.patientservice.controller.mapper.PatientEntityMapper;
import com.example.clinic.patientservice.model.Patient;
import com.example.clinic.patientservice.model.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/patients")
@RestController
@Timed("clinic.patient")
class PatientResource {

    private static final Logger log = LoggerFactory.getLogger(PatientResource.class);

    private final PatientRepository patientRepository;
    private final PatientEntityMapper patientEntityMapper;

    PatientResource(PatientRepository patientRepository, PatientEntityMapper patientEntityMapper) {
        this.patientRepository = patientRepository;
        this.patientEntityMapper = patientEntityMapper;
    }

    /**
     * Create Patient
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Patient createPatient(@Valid @RequestBody PatientRequest patientRequest) {
        Patient patient = patientEntityMapper.map(new Patient(), patientRequest);
        return patientRepository.save(patient);
    }

    /**
     * Read single Patient
     */
    @GetMapping("/{patientId}")
    public Optional<Patient> findPatient(@PathVariable("patientId") @Min(1) int patientId) {
        return patientRepository.findById(patientId);
    }

    /**
     * Read List of Patients
     */
    @GetMapping
    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    /**
     * Update Patient
     */
    @PutMapping("/{patientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updatePatient(@PathVariable("patientId") @Min(1) int patientId,
                              @Valid @RequestBody PatientRequest patientRequest) {
        final Patient patientModel = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient " + patientId + " not found"));

        patientEntityMapper.map(patientModel, patientRequest);
        log.info("Saving patient {}", patientModel);
        patientRepository.save(patientModel);
    }
}
