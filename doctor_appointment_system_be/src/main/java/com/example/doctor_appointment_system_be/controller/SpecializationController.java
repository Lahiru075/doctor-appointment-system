package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.SpecializationDTO;
import com.example.doctor_appointment_system_be.entity.Specialization;
import com.example.doctor_appointment_system_be.service.SpecializationService;
import jakarta.persistence.PrePersist;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/specializations")
@RequiredArgsConstructor
public class SpecializationController {

    private final SpecializationService specializationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Specialization>> createSpecialization(@Valid @RequestBody SpecializationDTO specializationDTO) {

        Specialization response = specializationService.createSpecialization(specializationDTO);

        ApiResponse<Specialization> apiResponse = ApiResponse.<Specialization>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Specialization created successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Specialization>>> getAllSpecializations() {

        List<Specialization> response = specializationService.getAllSpecializations();

        ApiResponse<List<Specialization>> apiResponse = ApiResponse.<List<Specialization>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Specializations retrieved successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
