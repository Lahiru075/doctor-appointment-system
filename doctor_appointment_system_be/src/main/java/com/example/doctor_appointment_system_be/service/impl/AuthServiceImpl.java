package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.*;
import com.example.doctor_appointment_system_be.entity.AuditLog;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.entity.User;
import com.example.doctor_appointment_system_be.enums.ActivityType;
import com.example.doctor_appointment_system_be.enums.Role;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.AuditLogRepository;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.repository.UserRepository;
import com.example.doctor_appointment_system_be.service.AuditLogService;
import com.example.doctor_appointment_system_be.service.AuthService;
import com.example.doctor_appointment_system_be.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public RegisterResponse register(RegisterDTO registerDTO) {

        log.info("Processing registration for email: {}", registerDTO.getEmail());

        if (userRepository.existsByEmail(registerDTO.getEmail())) {
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

        // save audit log
        auditLogService.logActivity(AuditLogRequestDTO.builder()
                .userId(savedUser.getId())
                .userEmail(savedUser.getEmail())
                .activityType(ActivityType.SECURITY)
                .action("New user registered successfully with role: " + user.getRole().name())
                .build());

        log.info("User registered successfully with ID: {} and Role: {}", savedUser.getId(), savedUser.getRole());

        return RegisterResponse.builder()
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    @Override
    public LoginResponse login(LoginDTO loginDTO) {

        log.info("Attempting authentication for email: {}", loginDTO.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getEmail(),
                            loginDTO.getPassword()
                    )
            );
        } catch (DisabledException e) {
            log.warn("Login blocked. Inactive account for email: {}", loginDTO.getEmail());
            throw new APIException(HttpStatus.UNAUTHORIZED, "Your account is currently inactive. Please contact support.");
        } catch (Exception e) {
            log.warn("Authentication failed for email: {} - Reason: {}", loginDTO.getEmail(), e.getMessage());
            throw new APIException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginDTO.getEmail()));

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // save audit log
        auditLogService.logActivity(AuditLogRequestDTO.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .activityType(ActivityType.SECURITY)
                .action("User logged in successfully as " + user.getRole().name())
                .build());

        log.info("User authenticated successfully: {} (Role: {})", user.getEmail(), user.getRole());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public String refreshToken(String refreshToken) {

        log.info("Processing access token refresh request");

        try {

            String email = jwtUtil.extractRefreshUsername(refreshToken);

            if (email == null) {
                log.warn("Refresh token validation failed: extracted username is null");
                throw new APIException(HttpStatus.UNAUTHORIZED, "Invalid or Expire refresh token");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new APIException(HttpStatus.UNAUTHORIZED, "Can not find User"));

            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .authorities("ROLE_" + user.getRole().name())
                    .build();

            if (!jwtUtil.isRefreshTokenValid(refreshToken, userDetails)) {
                log.warn("Refresh token is invalid or expired for user: {}", email);
                throw new APIException(HttpStatus.UNAUTHORIZED, "Invalid or Expire refresh token");
            }

            String newAccessToken = jwtUtil.generateAccessToken(user);
            log.info("New access token generated successfully for user: {}", email);

            return newAccessToken;

        } catch (Exception e) {
            log.error("Error occurred while verifying refresh token: {}", e.getMessage());
            throw new APIException(org.springframework.http.HttpStatus.UNAUTHORIZED, "An issue occurred while verifying the refresh token: " + e.getMessage());
        }

    }
}
