
package com.example.clinic.visitservice.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.util.Date;

@Entity
@Table(name = "visits")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "visit_date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date date = new Date();

    @Size(max = 8192)
    @Column(name = "description")
    private String description;

    
    @Column(name = "patient_id", nullable = false)
    private int patientId;

    // --- Getters and setters ---
    public Integer getId() {
        return this.id;
    }

    public Date getDate() {
        return this.date;
    }

    public String getDescription() {
        return this.description;
    }

    public int getPatient() {
        return this.patientId;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPatientId(int patient) {
        this.patientId = patient;
    }

    // --- Builder pattern ---
    public static final class VisitBuilder {
        private Integer id;
        private Date date;
        private @Size(max = 8192) String description;
        private int patient;

        private VisitBuilder() {
        }

        public static VisitBuilder aVisit() {
            return new VisitBuilder();
        }

        public VisitBuilder id(Integer id) {
            this.id = id;
            return this;
        }

        public VisitBuilder date(Date date) {
            this.date = date;
            return this;
        }

        public VisitBuilder description(String description) {
            this.description = description;
            return this;
        }

        public VisitBuilder patient(int patient) {
            this.patient = patient;
            return this;
        }

        public Visit build() {
            Visit visit = new Visit();
            visit.setId(id);
            visit.setDate(date);
            visit.setDescription(description);
            visit.setPatientId(patient);
            return visit;
        }
    }
}
