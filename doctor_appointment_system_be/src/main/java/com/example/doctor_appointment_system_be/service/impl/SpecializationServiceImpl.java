package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.SpecializationDTO;
import com.example.doctor_appointment_system_be.entity.Specialization;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.repository.SpecializationRepository;
import com.example.doctor_appointment_system_be.service.SpecializationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecializationServiceImpl implements SpecializationService {

    private final SpecializationRepository specializationRepository;

    @Override
    public Specialization createSpecialization(SpecializationDTO specializationDTO) {

        if (specializationRepository.existsByName(specializationDTO.getName())) {
            throw new APIException(HttpStatus.CREATED ,"Specialization with the same name already exists.");
        }

        Specialization specialization = Specialization.builder()
                .name(specializationDTO.getName())
                .description(specializationDTO.getDescription())
                .build();

        return specializationRepository.save(specialization);
    }

    @Override
    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }
}
