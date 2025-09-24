package com.example.clinic.patientservice.controller.mapper;

public interface Mapper<R, E> {
    E map(E response, R request);
}
