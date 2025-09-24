package com.example.clinic.patientservice.controller.mapper;
import com.example.clinic.patientservice.model.Patient;
import com.example.clinic.patientservice.controller.PatientRequest;
import org.springframework.stereotype.Component;

@Component
public class PatientEntityMapper implements Mapper<PatientRequest, Patient> {
    // This is done by hand for simplicity. For production, consider using MapStruct.
    @Override
    public Patient map(final Patient patient, final PatientRequest request) {
        patient.setFirstName(request.firstName());
        patient.setLastName(request.lastName());
        patient.setAddress(request.address());
        patient.setCity(request.city());
        patient.setTelephone(request.telephone());
        patient.setGender(request.gender());
        patient.setDateOfBirth(request.dateOfBirth());
        return patient;
    }
}
