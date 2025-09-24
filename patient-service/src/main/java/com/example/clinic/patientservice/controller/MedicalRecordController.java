package com.example.clinic.patientservice.controller;

import io.micrometer.core.annotation.Timed;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import com.example.clinic.patientservice.model.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Medical Records
 */
@RestController
@Timed("clinic.medicalrecord")
class MedicalRecordResource {

    private static final Logger log = LoggerFactory.getLogger(MedicalRecordResource.class);

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;

    MedicalRecordResource(MedicalRecordRepository medicalRecordRepository,
                          PatientRepository patientRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/recordTypes")
    public List<String> getRecordTypes() {
        return medicalRecordRepository.findRecordTypes();
    }

    @PostMapping("/patients/{patientId}/records")
    @ResponseStatus(HttpStatus.CREATED)
    public MedicalRecord createRecord(
        @RequestBody MedicalRecordRequest recordRequest,
        @PathVariable("patientId") @Min(1) int patientId) {

        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient " + patientId + " not found"));

        final MedicalRecord record = new MedicalRecord();
        patient.addRecord(record);
        return save(record, recordRequest);
    }

    @PutMapping("/patients/*/records/{recordId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateRecord(@RequestBody MedicalRecordRequest recordRequest) {
        int recordId = recordRequest.id();
        MedicalRecord record = findRecordById(recordId);
        save(record, recordRequest);
    }

    private MedicalRecord save(final MedicalRecord record, final MedicalRecordRequest recordRequest) {
        record.setDescription(recordRequest.description());
        record.setRecordDate(recordRequest.date());

        log.info("Saving medical record {}", record);
        return medicalRecordRepository.save(record);
    }

    @GetMapping("/patients/*/records/{recordId}")
public MedicalRecord findRecord(@PathVariable("recordId") int recordId) {
    return findRecordById(recordId);
}

private MedicalRecord findRecordById(int recordId) {
    return medicalRecordRepository.findById(recordId)
        .orElseThrow(() -> new ResourceNotFoundException("Medical record " + recordId + " not found"));
}

}
