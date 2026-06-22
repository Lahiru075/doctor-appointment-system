package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.PatientRequestDTO;
import com.example.doctor_appointment_system_be.dto.PatientResponseDTO;
import com.example.doctor_appointment_system_be.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientResponseDTO>>> getAllPatients(){

        List<PatientResponseDTO> patients = patientService.getAllPatients();

        ApiResponse<List<PatientResponseDTO>> apiResponse = ApiResponse.<List<PatientResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Patients retrieved successfully!")
                .data(patients)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDTO>> updatePatient(
            @PathVariable Long id,
            @RequestBody PatientRequestDTO patientRequestDTO
    ){

        PatientResponseDTO response = patientService.updatePatient(id, patientRequestDTO);

        ApiResponse<PatientResponseDTO> apiResponse = ApiResponse.<PatientResponseDTO>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Patient updated successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id){

        patientService.deletePatient(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Patient delete successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> togglePatientStatus(@PathVariable Long id){
        patientService.togglePatientStatus(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Patient toggle update successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
