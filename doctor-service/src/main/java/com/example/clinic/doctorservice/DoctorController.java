package com.example.clinic.doctorservice;

import com.example.clinic.doctorservice.model.doctor;
import com.example.clinic.doctorservice.model.DocRepository;
import com.example.clinic.doctorservice.model.Specialty;
import com.example.clinic.doctorservice.model.SpecialtyRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@Validated
public class DoctorController {

    private final DocRepository docRepository;
    private final SpecialtyRepository specialtyRepository;

    public DoctorController(DocRepository docRepository, SpecialtyRepository specialtyRepository) {
        this.docRepository = docRepository;
        this.specialtyRepository = specialtyRepository;
    }

    // LIST
    @GetMapping("/doctors")
    public List<doctor> list() {
        return docRepository.findAll();
    }

    // GET by id
    @GetMapping("/doctors/{id}")
    public doctor get(@PathVariable @Min(1) int id) {
        return docRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor " + id + " not found"));
    }

    // CREATE
    @PostMapping("/doctors")
    public ResponseEntity<doctor> create(@Valid @RequestBody DoctorRequest req) {
        doctor d = new doctor();
        apply(d, req);
        d = docRepository.save(d);
        return ResponseEntity.created(URI.create("/doctors/" + d.getId())).body(d);
    }

    // UPDATE (full)
    @PutMapping("/doctors/{id}")
    public ResponseEntity<doctor> update(@PathVariable @Min(1) int id, @Valid @RequestBody DoctorRequest req) {
    doctor d = docRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor " + id + " not found"));
    apply(d, req);
    d = docRepository.save(d);
    return ResponseEntity.ok(d);
}

    /** copy fields from request to entity */
    private void apply(doctor d, DoctorRequest req) {
        d.setFirstName(req.firstName());
        d.setLastName(req.lastName());
        d.setEmail(req.email());
        d.setPhone(req.phone());

        if (req.specialtyIds() != null) {
            var specs = new HashSet<Specialty>();
            for (Integer sid : req.specialtyIds()) {
                Specialty s = specialtyRepository.findById(sid)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Unknown specialty id: " + sid));
                specs.add(s);
            }
            d.setSpecialties(specs);
        }
    }

    /** request DTO */
    public record DoctorRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        String phone,
        Set<Integer> specialtyIds
    ) {}
}
