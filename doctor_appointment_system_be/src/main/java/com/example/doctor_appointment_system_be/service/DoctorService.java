package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.*;
import jakarta.validation.Valid;

import java.util.List;

public interface DoctorService {
    DoctorResponseDTO registerDoctor(DoctorRegisterDTO doctorRegisterDTO);

    List<DoctorResponseDTO> getAll();

    void updateDoctorStatus(Long id);

    DoctorResponseDTO updateDoctor(Long id, DoctorUpdateDTO doctorUpdateDTO);

    void deleteDoctor(Long id);

    List<DoctorResponseDTO> searchDoctors(String name, Long specializationId);

    List<DoctorSuggestionDTO> getSuggestions(String query);

    DoctorResponseDTO updateDoctorProfile(@Valid DoctorProfileUpdateDTO doctorProfileUpdateDTO, Long userId);

    DoctorResponseDTO getDoctorProfile(Long userId);

    void changePassword(@Valid PasswordChangeDTO passwordChangeDTO, Long userId);
}
