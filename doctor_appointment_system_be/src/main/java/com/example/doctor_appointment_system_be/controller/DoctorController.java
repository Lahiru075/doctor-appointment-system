package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.DoctorRegisterDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;
import com.example.doctor_appointment_system_be.dto.DoctorSuggestionDTO;
import com.example.doctor_appointment_system_be.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> registerDoctor(@Valid @RequestBody DoctorRegisterDTO doctorRegisterDTO) {

        DoctorResponseDTO response = doctorService.registerDoctor(doctorRegisterDTO);

        ApiResponse<DoctorResponseDTO> apiResponse = ApiResponse.<DoctorResponseDTO>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Doctor registered successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> getAllDoctors(){

        List<DoctorResponseDTO> doctors = doctorService.getAll();

        ApiResponse<List<DoctorResponseDTO>> apiResponse = ApiResponse.<List<DoctorResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Doctors retrieved successfully!")
                .data(doctors)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateDoctorStatus(@PathVariable Long id){

        doctorService.updateDoctorStatus(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Doctor status updated successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponseDTO>> updateDoctor(
            @PathVariable Long id,
            @RequestBody DoctorRegisterDTO doctorRegisterDTO)
    {

        DoctorResponseDTO response = doctorService.updateDoctor(id, doctorRegisterDTO);

        ApiResponse<DoctorResponseDTO> apiResponse = ApiResponse.<DoctorResponseDTO>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Doctor updated successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id){

        doctorService.deleteDoctor(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Doctor deleted successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DoctorResponseDTO>>> searchDoctors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long specializationId
    ){
        List<DoctorResponseDTO> doctors = doctorService.searchDoctors(name, specializationId);

        ApiResponse<List<DoctorResponseDTO>> apiResponse = ApiResponse.<List<DoctorResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Doctor search successfully!")
                .data(doctors)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<DoctorSuggestionDTO>>> getSuggestions(
            @RequestParam String query) {

        List<DoctorSuggestionDTO> suggestions = doctorService.getSuggestions(query);

        ApiResponse<List<DoctorSuggestionDTO>> apiResponse = ApiResponse.<List<DoctorSuggestionDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Suggestions fetched successfully!")
                .data(suggestions)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
