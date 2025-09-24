package com.example.clinic.doctorservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.example.clinic.doctorservice.model.doctor;
import com.example.clinic.doctorservice.model.DocRepository;

@RestController
public class DoctorController {

    private final DocRepository DocRepository;

    DoctorController(DocRepository DocRepository) {
        this.DocRepository = DocRepository;
    }

    @GetMapping("/doctors")
    public List<doctor> showResourcesDoctorList() {
        return DocRepository.findAll();
    }
}
