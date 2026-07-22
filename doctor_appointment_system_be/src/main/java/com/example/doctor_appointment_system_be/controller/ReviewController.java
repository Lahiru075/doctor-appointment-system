package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.ReviewRequestDTO;
import com.example.doctor_appointment_system_be.dto.ReviewResponseDTO;
import com.example.doctor_appointment_system_be.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<Void>> addReview(@Valid @RequestBody ReviewRequestDTO reviewRequestDTO) {

        reviewService.addReview(reviewRequestDTO);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("Review added successfully!")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getReviewsByDoctorId(@PathVariable Long doctorId) {

        List<ReviewResponseDTO> reviews = reviewService.getReviewsByDoctorId(doctorId);

        ApiResponse<List<ReviewResponseDTO>> apiResponse = ApiResponse.<List<ReviewResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Reviews retrieved successfully!")
                .data(reviews)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
