
package com.example.clinic.doctorservice.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocRepository extends JpaRepository<doctor, Integer> {
}
