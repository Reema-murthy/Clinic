package com.example.clinic.doctorservice.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PropertyComparator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.xml.bind.annotation.XmlElement;

@Entity
@Table(name = "doctors")
public class doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Email
    @Column(name = "email", nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "phone", length = 32)
    private String phone;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "doctor_specialties",
        joinColumns = @JoinColumn(name = "doctor_id"),
        inverseJoinColumns = @JoinColumn(name = "specialty_id")
    )
    private Set<Specialty> specialties = new HashSet<>();

    public doctor() {}

    // --- getters
    public Integer getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }

    // Sorted, read-only view for serialization
    @XmlElement
    public List<Specialty> getSpecialties() {
        List<Specialty> sorted = new ArrayList<>(specialties);
        PropertyComparator.sort(sorted, new MutableSortDefinition("name", true, true));
        return Collections.unmodifiableList(sorted);
    }

    public int getNrOfSpecialties() { return specialties.size(); }

    // --- setters
    public void setId(Integer id) { this.id = id; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }

    // --- collection helpers
    protected Set<Specialty> getSpecialtiesInternal() { return specialties; }

    public void addSpecialty(Specialty specialty) { specialties.add(specialty); }
    public void removeSpecialty(Specialty specialty) { specialties.remove(specialty); }
    public void setSpecialties(Set<Specialty> specs) {
        specialties.clear();
        if (specs != null) specialties.addAll(specs);
    }

    @Override public String toString() {
        return "doctor{id=%d, firstName='%s', lastName='%s'}"
            .formatted(id, firstName, lastName);
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof doctor d)) return false;
        return Objects.equals(id, d.id);
    }

    @Override public int hashCode() { return Objects.hashCode(id); }
}
