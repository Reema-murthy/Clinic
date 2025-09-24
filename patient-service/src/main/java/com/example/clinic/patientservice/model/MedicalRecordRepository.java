package com.example.clinic.patientservice.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository interface for <code>MedicalRecord</code> domain objects.
 *
 * All method names are compliant with Spring Data naming
 * conventions so this interface can easily be extended for Spring Data.
 */
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {

    /**
     * Find all medical records belonging to a given patient.
     * @param patientId ID of the patient
     * @return list of medical records
     */
    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.id = :patientId ORDER BY m.recordDate DESC")
    List<MedicalRecord> findByPatientId(@Param("patientId") int patientId);

    /**
     * Retrieve all available record types as distinct strings.
     */
    @Query("SELECT DISTINCT m.recordType FROM MedicalRecord m ORDER BY m.recordType")
    List<String> findRecordTypes();
}
