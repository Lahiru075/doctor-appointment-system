package com.example.doctor_appointment_system_be.mapper;

import com.example.doctor_appointment_system_be.dto.PatientResponseDTO;
import com.example.doctor_appointment_system_be.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PatientMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phoneNumber", source = "user.phoneNumber")
    @Mapping(target = "isActive", source = "user.active")

    PatientResponseDTO toDTO(Patient patient);

    List<PatientResponseDTO> toDTOList(List<Patient> patients);
}
