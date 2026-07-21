package com.example.doctor_appointment_system_be.mapper;

import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;
import com.example.doctor_appointment_system_be.entity.Doctor;
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

    DoctorResponseDTO toDTO(Doctor doctor);

    List<DoctorResponseDTO> toDTOList(List<Doctor> doctors);
}
