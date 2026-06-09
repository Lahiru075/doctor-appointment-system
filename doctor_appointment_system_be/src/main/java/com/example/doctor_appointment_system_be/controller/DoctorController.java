package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.DoctorRegisterDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponse;
import com.example.doctor_appointment_system_be.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponse>> registerDoctor(@Valid @RequestBody DoctorRegisterDTO doctorRegisterDTO) {

        DoctorResponse response = doctorService.registerDoctor(doctorRegisterDTO);

        ApiResponse<DoctorResponse> apiResponse = ApiResponse.<DoctorResponse>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Doctor registered successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }
}
