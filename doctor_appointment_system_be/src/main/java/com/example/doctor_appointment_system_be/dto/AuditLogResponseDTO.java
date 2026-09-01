package com.example.doctor_appointment_system_be.dto;

import com.example.doctor_appointment_system_be.enums.ActivityType;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponseDTO {
    private Long id;
    private Long userId;
    private String userEmail;
    private String actorName;
    private ActivityType activityType;
    private String action;
    private LocalDateTime createdAt;
}
