package com.example.clinic.patientservice.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;

/**
 * Request object for creating or updating Patient entities.
 */
public record PatientRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String address,
        @NotBlank String city,
        @NotBlank
        @Digits(fraction = 0, integer = 12)
        String telephone,
        @NotBlank String gender,
        @JsonFormat(pattern = "yyyy-MM-dd") Date dateOfBirth
) { }
