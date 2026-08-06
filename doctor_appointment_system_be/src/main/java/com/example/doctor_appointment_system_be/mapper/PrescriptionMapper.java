package com.example.doctor_appointment_system_be.mapper;

import com.example.doctor_appointment_system_be.dto.PrescriptionResponseDTO;
import com.example.doctor_appointment_system_be.entity.Prescription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PrescriptionMapper {

    @Mapping(target = "doctorName", source = "doctor.user.fullName")
    @Mapping(target = "specializationName", source = "doctor.specialization.name")
    @Mapping(target = "patientName", source = "patient.user.fullName")
    @Mapping(target = "appointmentId", source = "appointment.id")
    @Mapping(target = "createdAt", expression = "java(prescription.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern(\"yyyy-MM-dd HH:mm\")))")
    PrescriptionResponseDTO toDTO(Prescription prescription);

    List<PrescriptionResponseDTO> toDTOList(List<Prescription> prescriptions);
}
