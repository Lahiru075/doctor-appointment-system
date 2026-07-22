package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.AppointmentRequestDTO;
import com.example.doctor_appointment_system_be.dto.AppointmentResponseDTO;
import com.example.doctor_appointment_system_be.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(@Valid @RequestBody AppointmentRequestDTO appointmentRequestDTO){

        AppointmentResponseDTO response = appointmentService.bookAppointment(appointmentRequestDTO);

        ApiResponse<AppointmentResponseDTO> apiResponse = ApiResponse.<AppointmentResponseDTO>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Appointment booked successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);

    }

    @GetMapping("/patients/{userId}")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getMyAppointments(@PathVariable Long userId){

        List<AppointmentResponseDTO> response = appointmentService.getMyAppointments(userId);

        System.out.println(response.size());

        ApiResponse<List<AppointmentResponseDTO>> apiResponse = ApiResponse.<List<AppointmentResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Appointments fetch successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(@PathVariable Long id){

        appointmentService.cancelAppointment(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Appointment canceled successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PutMapping("/complete/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> completeAppointment(@PathVariable Long id){

        appointmentService.completeAppointment(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Appointment completed successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/doctors/{userId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getDoctorAppointments(@PathVariable Long userId) {

        List<AppointmentResponseDTO> response = appointmentService.getDoctorAppointments(userId);

        ApiResponse<List<AppointmentResponseDTO>> apiResponse = ApiResponse.<List<AppointmentResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Doctor appointments fetched successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }


}
