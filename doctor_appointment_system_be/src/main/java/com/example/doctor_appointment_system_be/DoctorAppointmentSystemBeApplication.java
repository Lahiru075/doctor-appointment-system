package com.example.doctor_appointment_system_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DoctorAppointmentSystemBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoctorAppointmentSystemBeApplication.class, args);
    }

}
