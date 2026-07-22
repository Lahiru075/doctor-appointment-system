package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.ReviewRequestDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import com.example.doctor_appointment_system_be.entity.Review;
import com.example.doctor_appointment_system_be.enums.AppointmentStatus;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.ReviewRepository;
import com.example.doctor_appointment_system_be.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public void addReview(ReviewRequestDTO reviewRequestDTO) {

        Appointment appointment = appointmentRepository.findByIdWithPatientAndDoctor(reviewRequestDTO.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.COMPLETED){
            throw new APIException(HttpStatus.BAD_REQUEST, "Reviews can only be submitted for completed appointments.");
        }

        if (reviewRepository.existsByAppointmentId(appointment.getId())){
            throw new APIException(HttpStatus.CONFLICT, "A review has already been submitted for this appointment.");
        }

        Review review = Review.builder()
                .rating(reviewRequestDTO.getRating())
                .comment(reviewRequestDTO.getComment())
                .appointment(appointment)
                .patient(appointment.getPatient())
                .doctor(appointment.getDoctor())
                .build();

        reviewRepository.save(review);
    }
}
