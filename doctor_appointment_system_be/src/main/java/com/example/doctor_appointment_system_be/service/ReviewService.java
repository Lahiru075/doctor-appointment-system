package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.ReviewRequestDTO;
import jakarta.validation.Valid;

public interface ReviewService {
    void addReview(@Valid ReviewRequestDTO reviewRequestDTO);
}
