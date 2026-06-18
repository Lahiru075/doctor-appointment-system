package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.SpecializationDTO;
import com.example.doctor_appointment_system_be.dto.SpecializationResponseDTO;
import com.example.doctor_appointment_system_be.entity.Specialization;

import java.util.List;

public interface SpecializationService {
    SpecializationResponseDTO createSpecialization(SpecializationDTO specializationDTO);

    List<SpecializationResponseDTO> getAllSpecializations();

    SpecializationResponseDTO updateSpecialization(Long id, SpecializationDTO specializationDTO);

    void deleteSpecialization(Long id);
}
