package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.AppointmentRequestDTO;
import com.example.doctor_appointment_system_be.dto.AppointmentResponseDTO;
import com.example.doctor_appointment_system_be.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

        ApiResponse<List<AppointmentResponseDTO>> apiResponse = ApiResponse.<List<AppointmentResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Appointments fetch successfully!")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }


}
