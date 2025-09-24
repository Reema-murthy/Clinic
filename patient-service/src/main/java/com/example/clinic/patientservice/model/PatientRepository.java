package com.example.clinic.patientservice.model;

import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Repository interface for <code>Patient</code> domain objects.
 * 
 * All method names are compliant with Spring Data naming
 * conventions so this interface can easily be extended for Spring Data.
 *
 * Example: http://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation
 */
public interface PatientRepository extends JpaRepository<Patient, Integer> {
}
