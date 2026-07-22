package com.example.doctor_appointment_system_be.mapper;

import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;
import com.example.doctor_appointment_system_be.entity.Doctor;
import com.example.doctor_appointment_system_be.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    @Mapping(target = "doctorId", source = "id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "specializationName", source = "specialization.name")

    @Mapping(target = "averageRating", expression = "java(calculateAverageRating(doctor.getReviews()))")
    DoctorResponseDTO toDTO(Doctor doctor);

    List<DoctorResponseDTO> toDTOList(List<Doctor> doctors);

    default Double calculateAverageRating(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }
        double avg = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);

        // (EG: 4.66 -> 4.7)
        return Math.round(avg * 10.0) / 10.0;
    }
}
