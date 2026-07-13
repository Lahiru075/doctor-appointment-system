package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.DoctorRegisterDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;
import com.example.doctor_appointment_system_be.dto.DoctorSuggestionDTO;

import java.util.List;

public interface DoctorService {
    DoctorResponseDTO registerDoctor(DoctorRegisterDTO doctorRegisterDTO);

    List<DoctorResponseDTO> getAll();

    void updateDoctorStatus(Long id);

    DoctorResponseDTO updateDoctor(Long id, DoctorRegisterDTO doctorRegisterDTO);

    void deleteDoctor(Long id);

    List<DoctorResponseDTO> searchDoctors(String name, Long specializationId);

    List<DoctorSuggestionDTO> getSuggestions(String query);
}
