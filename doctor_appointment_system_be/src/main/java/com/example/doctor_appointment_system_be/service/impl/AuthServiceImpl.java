package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.AuthResponse;
import com.example.doctor_appointment_system_be.dto.LoginDTO;
import com.example.doctor_appointment_system_be.dto.RegisterDTO;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.entity.User;
import com.example.doctor_appointment_system_be.enums.Role;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.repository.UserRepository;
import com.example.doctor_appointment_system_be.service.AuthService;
import com.example.doctor_appointment_system_be.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterDTO registerDTO) {

        if (userRepository.existsByEmail(registerDTO.getEmail())){
            throw new APIException(HttpStatus.CONFLICT, "Email is already in use");
        }

        User user = User.builder()
                .fullName(registerDTO.getFullName())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .phoneNumber(registerDTO.getPhoneNumber())
                .role(Role.PATIENT)
                .build();

        // first save user to user table
        User savedUser = userRepository.save(user);

        Patient patient = Patient.builder()
                .user(savedUser)
                .bloodGroup(registerDTO.getBloodGroup())
                .medicalHistory(registerDTO.getMedicalHistory())
                .build();

        // then save patient to patient table
        patientRepository.save(patient);

        return AuthResponse.builder()
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    @Override
    public AuthResponse login(LoginDTO loginDTO) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getEmail(),
                            loginDTO.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new APIException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginDTO.getEmail()));

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
