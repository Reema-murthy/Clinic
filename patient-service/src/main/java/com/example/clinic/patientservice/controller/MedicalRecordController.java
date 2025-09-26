package com.example.clinic.patientservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.clinic.patientservice.model.MedicalRecord;
import com.example.clinic.patientservice.model.MedicalRecordRepository;
import com.example.clinic.patientservice.model.Patient;
import com.example.clinic.patientservice.model.PatientRepository;

import io.micrometer.core.annotation.Timed;
import jakarta.validation.constraints.Min;

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

    @GetMapping("/patients/{patientId}/records")
    public List<MedicalRecord> listRecords(@PathVariable("patientId") @Min(1) int patientId) {
        // Optional: ensure patient exists
        patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient " + patientId + " not found"));
        return medicalRecordRepository.findByPatientId(patientId);
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
