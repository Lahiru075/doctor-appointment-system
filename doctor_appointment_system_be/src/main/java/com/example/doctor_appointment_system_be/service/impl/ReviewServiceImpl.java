package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.ReviewRequestDTO;
import com.example.doctor_appointment_system_be.dto.ReviewResponseDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import com.example.doctor_appointment_system_be.entity.Review;
import com.example.doctor_appointment_system_be.enums.AppointmentStatus;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.mapper.ReviewMapper;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.ReviewRepository;
import com.example.doctor_appointment_system_be.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final ReviewMapper reviewMapper;

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

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getReviewsByDoctorId(Long doctorId) {

        if (!doctorRepository.existsById(doctorId)){
            throw new ResourceNotFoundException("Doctor not found with ID: "+ doctorId);
        }

        return reviewMapper.toDTOList(reviewRepository.findReviewsByDoctorId(doctorId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getDoctorReviews(Long userId) {
        List<Review> reviews = reviewRepository.findReviewsByDoctorUserId(userId);
        return reviewMapper.toDTOList(reviews);
    }
}
