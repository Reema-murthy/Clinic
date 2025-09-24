package com.example.clinic.doctorservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DoctorController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Doctor Service";
    }
}
