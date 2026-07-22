package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.ReviewRequestDTO;
import com.example.doctor_appointment_system_be.dto.ReviewResponseDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface ReviewService {
    void addReview(@Valid ReviewRequestDTO reviewRequestDTO);

    List<ReviewResponseDTO> getReviewsByDoctorId(Long doctorId);
}
