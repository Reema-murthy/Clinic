package com.example.clinic.patientservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PatientController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Patient Service";
    }
}
