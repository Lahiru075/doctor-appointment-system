package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.SpecializationDTO;
import com.example.doctor_appointment_system_be.entity.Specialization;

import java.util.List;

public interface SpecializationService {
    Specialization createSpecialization(SpecializationDTO specializationDTO);

    List<Specialization> getAllSpecializations();
}
