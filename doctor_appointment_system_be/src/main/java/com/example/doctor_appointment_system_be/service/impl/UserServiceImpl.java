package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.UserResponse;
import com.example.doctor_appointment_system_be.entity.User;
import com.example.doctor_appointment_system_be.repository.UserRepository;
import com.example.doctor_appointment_system_be.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getMyDetails(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));


        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .build();
    }
}
