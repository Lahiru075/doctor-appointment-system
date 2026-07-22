package com.example.doctor_appointment_system_be.mapper;

import com.example.doctor_appointment_system_be.dto.ReviewResponseDTO;
import com.example.doctor_appointment_system_be.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "patientName", source = "patient.user.fullName")
    @Mapping(target = "createdAt", expression = "java(review.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern(\"yyyy-MM-dd HH:mm\")))")

    ReviewResponseDTO toDTO(Review review);

    List<ReviewResponseDTO> toDTOList(List<Review> reviews);
}
