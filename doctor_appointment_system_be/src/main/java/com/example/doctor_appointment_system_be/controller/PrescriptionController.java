package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.PrescriptionRequestDTO;
import com.example.doctor_appointment_system_be.dto.PrescriptionResponseDTO;
import com.example.doctor_appointment_system_be.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/api/v1/prescriptions")
@RestController
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> createPrescription(
            @Valid @RequestBody PrescriptionRequestDTO prescriptionRequestDTO
    ) {
        prescriptionService.createPrescription(prescriptionRequestDTO);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Prescription saved successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);

    }

    @GetMapping("/patient/{userId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getPatientPrescriptions(@PathVariable Long userId) {

        List<PrescriptionResponseDTO> response = prescriptionService.getPatientPrescriptions(userId);

        ApiResponse<List<PrescriptionResponseDTO>> apiResponse = ApiResponse.<List<PrescriptionResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Prescriptions fetched successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionByAppointmentId(@PathVariable Long appointmentId) {

        PrescriptionResponseDTO response = prescriptionService.getPrescriptionByAppointmentId(appointmentId);

        ApiResponse<PrescriptionResponseDTO> apiResponse = ApiResponse.<PrescriptionResponseDTO>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Prescription fetched successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
