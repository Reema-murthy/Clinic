package com.example.clinic.patientservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PropertyComparator;
import org.springframework.core.style.ToStringCreator;

import java.util.*;

/**
 * Simple JavaBean domain object representing a patient.
 */
@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name")
    @NotBlank
    private String firstName;

    @Column(name = "last_name")
    @NotBlank
    private String lastName;

    @Column(name = "gender")
    @NotBlank
    private String gender;

    @Column(name = "date_of_birth")
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(name = "address")
    @NotBlank
    private String address;

    @Column(name = "city")
    @NotBlank
    private String city;

    @Column(name = "telephone")
    @NotBlank
    @Digits(fraction = 0, integer = 12)
    private String telephone;

    @Column(name = "email")
    @Email
    private String email;

    @Column(name = "blood_type")
    private String bloodType;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "patient")
    private Set<MedicalRecord> records;

    protected Set<MedicalRecord> getRecordsInternal() {
        if (this.records == null) {
            this.records = new HashSet<>();
        }
        return this.records;
    }

    public List<MedicalRecord> getRecords() {
        List<MedicalRecord> sortedRecords = new ArrayList<>(getRecordsInternal());
        PropertyComparator.sort(sortedRecords, new MutableSortDefinition("date", true, true));
        return Collections.unmodifiableList(sortedRecords);
    }

    public void addRecord(MedicalRecord record) {
        getRecordsInternal().add(record);
        record.setPatient(this);
    }

    /**
     * Helper method for MedicalRecordResource to set date
     */
    public void setDate(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    @Override
    public String toString() {
        return new ToStringCreator(this)
                .append("id", this.getId())
                .append("firstName", this.getFirstName())
                .append("lastName", this.getLastName())
                .append("gender", this.gender)
                .append("dateOfBirth", this.dateOfBirth)
                .append("address", this.address)
                .append("city", this.city)
                .append("telephone", this.telephone)
                .append("email", this.email)
                .append("bloodType", this.bloodType)
                .toString();
    }

    // Getters and Setters
    public Integer getId() { return this.id; }
    public String getFirstName() { return this.firstName; }
    public String getLastName() { return this.lastName; }
    public String getGender() { return this.gender; }
    public Date getDateOfBirth() { return this.dateOfBirth; }
    public String getAddress() { return this.address; }
    public String getCity() { return this.city; }
    public String getTelephone() { return this.telephone; }
    public String getEmail() { return this.email; }
    public String getBloodType() { return this.bloodType; }

    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setGender(String gender) { this.gender = gender; }
    public void setDateOfBirth(Date dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setAddress(String address) { this.address = address; }
    public void setCity(String city) { this.city = city; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public void setEmail(String email) { this.email = email; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    // Placeholder methods to satisfy MedicalRecordResource dependencies
    public void findRecordTypeById(int typeId) {
        // This can be implemented in MedicalRecordRepository or service layer
    }

}
