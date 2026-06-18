package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.SpecializationDTO;
import com.example.doctor_appointment_system_be.dto.SpecializationResponseDTO;
import com.example.doctor_appointment_system_be.service.SpecializationService;
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
    public ResponseEntity<ApiResponse<SpecializationResponseDTO>> createSpecialization(@Valid @RequestBody SpecializationDTO specializationDTO) {

        SpecializationResponseDTO response = specializationService.createSpecialization(specializationDTO);

        ApiResponse<SpecializationResponseDTO> apiResponse = ApiResponse.<SpecializationResponseDTO>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Specialization created successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SpecializationResponseDTO>> updateSpecialization(
            @PathVariable Long id ,
            @Valid @RequestBody SpecializationDTO specializationDTO
    ){

        SpecializationResponseDTO response = specializationService.updateSpecialization(id, specializationDTO);

        ApiResponse<SpecializationResponseDTO> apiResponse = ApiResponse.<SpecializationResponseDTO>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Specialization update successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSpecialization(@PathVariable Long id){

        specializationService.deleteSpecialization(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Specialization delete successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SpecializationResponseDTO>>> getAllSpecializations() {

        List<SpecializationResponseDTO> response = specializationService.getAllSpecializations();

        ApiResponse<List<SpecializationResponseDTO>> apiResponse = ApiResponse.<List<SpecializationResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Specializations retrieved successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
