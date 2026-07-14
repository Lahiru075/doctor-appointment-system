package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.AvailableTimeSlotDTO;
import com.example.doctor_appointment_system_be.dto.TimeSlotDTO;
import com.example.doctor_appointment_system_be.dto.WeeklyScheduleDTO;
import com.example.doctor_appointment_system_be.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/time-slot")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @PostMapping("/generate/{userId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> generateWeeklySlots(
            @PathVariable Long userId,
            @RequestBody WeeklyScheduleDTO weeklyScheduleDTO
    ){

        timeSlotService.generateWeeklySlots(userId, weeklyScheduleDTO);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Weekly time slots generated successfully!")
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<WeeklyScheduleDTO>> getWeeklySlots(@PathVariable Long userId) {
        WeeklyScheduleDTO schedule  = timeSlotService.getAvailability(userId);

        ApiResponse<WeeklyScheduleDTO> apiResponse = ApiResponse.<WeeklyScheduleDTO>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Availability retrieved successfully!")
                .timestamp(LocalDateTime.now())
                .data(schedule)
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/available/{doctorId}")
    public ResponseEntity<ApiResponse<List<AvailableTimeSlotDTO>>> getAvailableSlots(
            @PathVariable Long doctorId
    ){
        List<AvailableTimeSlotDTO> timeSlotList = timeSlotService.getAvailableSlots(doctorId);

        ApiResponse<List<AvailableTimeSlotDTO>> apiResponse = ApiResponse.<List<AvailableTimeSlotDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Availability Slots retrieved successfully!")
                .timestamp(LocalDateTime.now())
                .data(timeSlotList)
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
