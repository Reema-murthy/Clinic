
package com.example.clinic.visitservice.model;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitRepository extends JpaRepository<Visit, Integer> {

    // Find visits for a single patient
    List<Visit> findByPatientId(int patientId);

    // Find visits for multiple patients
    List<Visit> findByPatientIdIn(Collection<Integer> patientIds);
}
