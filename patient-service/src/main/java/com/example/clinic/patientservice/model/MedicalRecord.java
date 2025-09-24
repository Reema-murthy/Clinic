package com.example.clinic.patientservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.core.style.ToStringCreator;

import java.util.Date;
import java.util.Objects;

/**
 * Simple business object representing a patient's medical record.
 */
@Entity
@Table(name = "medical_records")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "record_type", nullable = false)
    private String recordType; // e.g., "Consultation", "Surgery", "Prescription"

    @Column(name = "description")
    private String description; // details of the record

    @Column(name = "record_date", nullable = false)
    private Date recordDate;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;

    @Override
    public String toString() {
        return new ToStringCreator(this)
                .append("id", this.getId())
                .append("recordType", this.getRecordType())
                .append("description", this.getDescription())
                .append("recordDate", this.getRecordDate())
                .append("patientFirstName", this.getPatient().getFirstName())
                .append("patientLastName", this.getPatient().getLastName())
                .toString();
    }

    // Getters and Setters
    public Integer getId() { return this.id; }
    public String getRecordType() { return this.recordType; }
    public String getDescription() { return this.description; }
    public Date getRecordDate() { return this.recordDate; }
    public Patient getPatient() { return this.patient; }

    public void setId(Integer id) { this.id = id; }
    public void setRecordType(String recordType) { this.recordType = recordType; }
    public void setDescription(String description) { this.description = description; }
    public void setRecordDate(Date recordDate) { this.recordDate = recordDate; }
    public void setPatient(Patient patient) { this.patient = patient; }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        MedicalRecord that = (MedicalRecord) o;
        return Objects.equals(id, that.id)
                && Objects.equals(recordType, that.recordType)
                && Objects.equals(description, that.description)
                && Objects.equals(recordDate, that.recordDate)
                && Objects.equals(patient, that.patient);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, recordType, description, recordDate, patient);
    }
}
