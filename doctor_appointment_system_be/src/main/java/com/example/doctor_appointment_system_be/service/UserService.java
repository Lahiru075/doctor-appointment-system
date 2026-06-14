package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.UserResponse;

public interface UserService {
    UserResponse getMyDetails(String email);
}
