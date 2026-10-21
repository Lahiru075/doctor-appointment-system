# 🏥 CliniQ – Enterprise Doctor Appointment & Healthcare Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.x-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg?logo=openjdk)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**CliniQ** is a production-ready, full-stack enterprise healthcare platform designed to streamline outpatient consultations, doctor scheduling, electronic prescriptions, and multi-role clinical administration. Built with **Spring Boot 3.5**, **React**, **TypeScript**, and **PostgreSQL**, CliniQ follows **Clean Architecture**, stateless security standards, and strict database query optimizations.

---

## 📑 Table of Contents
- [Architectural Overview](#-architectural-overview)
- [Key Features by Role](#-key-features-by-role)
- [Engineering Highlights](#-engineering-highlights)
- [Tech Stack](#-tech-stack)
- [Database Schema & Entity Model](#-database-schema--entity-model)
- [API Documentation & Testing](#-api-documentation--testing)
- [Getting Started](#-getting-started)
- [Configuration & Environment](#-configuration--environment)

---

## 🏛 Architectural Overview

CliniQ adheres to strict **Clean Layered Architecture** with unidirectional dependency flow, decoupling presentation, business rules, and persistent storage:

```
[ Frontend Client (React + TypeScript + Tailwind v4) ]
                          │
                   (Stateless JWT)
                          ▼
            [ API Controllers / DTOs ]
                          │
          (Compiled MapStruct DTO Pipelines)
                          ▼
         [ Service Layer (Business Domain) ]
                          │
  (Hibernate Dirty Checking & JPA Transactions)
                          ▼
    [ Repository Layer (Optimized JPQL Queries) ]
                          │
                          ▼
            [ PostgreSQL Relational DB ]
```

---

## ✨ Key Features by Role

### 🩺 Patient Portal
* **Doctor Discovery:** Real-time doctor search filtered by medical specialization and practitioner name [1].
* **TimeSlot Booking Engine:** Interactive date-driven slot picker with double-booking prevention [1].
* **Smart Cancellation:** 24-hour advance cancellation constraint with automatic slot freeing and relationship unlinking [1].
* **Consultation History:** Historical and upcoming consultation tracking [1].
* **Verified Reviews:** 1–5 star rating and feedback submission for completed consultations [1].
* **Digital Prescriptions:** Diagnostic and dosage review with client-side **vector PDF downloads (`jsPDF`)**.

### 👨‍⚕️ Doctor Portal
* **Availability Management:** Automated bulk weekly slot generation based on consultation durations.
* **Consultation Workspace:** Queue of confirmed patients and consultation completion workflows [1].
* **E-Prescriptions:** Direct clinical diagnosis notes and structured medication dosage issuance [1].
* **Performance Telemetry:** Patient reviews archive and automated average rating computations [1].

### 🛡️ Admin Command Center ("Emerald Command" UI)
* **Live System Telemetry:** Total medical staff, registered patients, specializations, and booking metrics.
* **7-Day Volume Trends Chart:** Interactive timeline tracking daily booking volumes with zero-gap calendar normalization.
* **Practitioner & Patient Governance:** Instant status toggles (Active/Inactive) and soft deletes via bulk JPA queries [1.2.2].
* **System Audit Logging:** Real-time searchable and filterable audit trail tracking all platform actions (`SECURITY`, `BOOKING`, `PRESCRIPTION`, `REVIEW`, `PROFILE`).

---

## ⚡ Engineering Highlights

* **N+1 Query Elimination:** Strictly resolved Hibernate N+1 query overhead using explicit JPQL `JOIN FETCH` (and `LEFT JOIN FETCH` for nullable slot allocations), ensuring single-query fetches across deeply nested relations (`Appointment -> Patient -> Doctor -> Specialization -> TimeSlot`) [1.1.3].
* **Stateless JWT Security & Refresh Rotation:** Implemented stateless access/refresh tokens with transparent Axios interceptor auto-refresh logic and public route bypass mechanisms [1.2.2].
* **Automated Schedule Cleanup Scheduler:** Background cron job (`@Scheduled(cron = "0 0 0 * * SUN")`) automatically cleans up past unbooked time slots every Sunday at midnight while preserving booked consultation records.
* **Database Concurrency Protection:** Unique foreign key constraints on `Appointment -> TimeSlot` prevent race conditions and concurrent double-booking.
* **Hibernate Dirty Checking & Read-Only Transactions:** Fully leveraged `@Transactional(readOnly = true)` on read pathways to disable dirty-check snapshot comparisons, maximizing memory throughput [1.1.2, 1.2.2].
* **Enterprise Audit Logging:** Centralized asynchronous audit service capturing user identity, action description, and timestamp into indexed PostgreSQL tables without blocking core transaction flows [1].

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.5.x, Spring Data JPA, Hibernate, Spring Security, MapStruct 1.5.5, Lombok [1, 1.1.2] |
| **Frontend** | React, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion (`motion/react`), Axios |
| **Database** | PostgreSQL 15+ (Indexed queries, Unique Constraints) |
| **Testing** | JUnit 5, Mockito |
| **Documentation & Logs** | Springdoc OpenAPI 3.x (Swagger UI), SLF4J / Logback (Daily rolling log policies) |
| **Build & Tooling** | Maven, Vite, npm, Git |

---

## 🔒 Role-Based Access Control (RBAC) & API Catalog

CliniQ implements strict role-based authorization ensuring endpoints are guarded by granular Spring Security filters:

| Module | HTTP Method | Endpoint | Authorized Roles | Description |
| :--- | :---: | :--- | :---: | :--- |
| **Authentication** | `POST` | `/api/v1/auth/register` | `PUBLIC` | Patient account registration |
| | `POST` | `/api/v1/auth/login` | `PUBLIC` | Authenticate and obtain JWT tokens |
| | `POST` | `/api/v1/auth/refresh` | `PUBLIC` | Obtain new access token via refresh token |
| **Patient Portal** | `GET` | `/api/v1/patient/doctors` | `PATIENT` | Search doctors by name & specialization |
| | `POST` | `/api/v1/appointments/book` | `PATIENT` | Book a consultation time slot |
| | `PUT` | `/api/v1/appointments/cancel/{id}` | `PATIENT` | Cancel appointment (24h advance constraint) |
| | `POST` | `/api/v1/reviews` | `PATIENT` | Submit 1–5 star consultation review |
| **Doctor Portal** | `POST` | `/api/v1/doctor/schedule/weekly` | `DOCTOR` | Bulk-generate weekly availability slots |
| | `PUT` | `/api/v1/appointments/complete/{id}`| `DOCTOR` | Finalize consultation status |
| | `POST` | `/api/v1/prescriptions` | `DOCTOR` | Issue electronic prescription & medications |
| **Admin Command** | `GET` | `/api/v1/admin/dashboard/stats` | `ADMIN` | Retrieve real-time telemetry & 7-day trends |
| | `GET` | `/api/v1/admin/audit-logs` | `ADMIN` | Query indexed system audit trails |
| | `PUT` | `/api/v1/admin/doctors/{id}/status` | `ADMIN` | Toggle medical practitioner active status |

---

## 🧪 API Documentation & Testing

### Interactive Swagger UI
CliniQ exposes interactive OpenAPI documentation with **JWT Bearer Authentication**:
- **Swagger UI URL:** `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

### Automated Unit Testing Suite (JUnit 5 & Mockito)
Core business invariants (double-booking constraints, 24-hour advance cancellations, duplicate registration conflicts, and credential checks) are verified via automated unit test suites:

```bash
# Run all unit tests
mvn clean test

# Run specific service test suites
mvn test -Dtest=AppointmentServiceTest
mvn test -Dtest=AuthServiceTest
```

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK):** Version 17+
- **Node.js:** Version 18+ & npm
- **Database:** PostgreSQL 15+ installed and running locally

---

```bash
git clone https://github.com/Lahiru075/doctor-appointment-system.git
cd doctor-appointment-system
```

### 1. Backend Setup (Spring Boot)
```bash
# Navigate to the backend directory
cd doctor_appointment_system_be

# Copy the environment template to your active properties file
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Build and start the Spring Boot application
mvn clean spring-boot:run
```

*Backend runs on `http://localhost:8080`*
*Swagger Documentation: `http://localhost:8080/swagger-ui/index.html`*

---

### 2. Frontend Setup (React + Vite)
```bash
cd doctor_appointment_system_fe

npm install

npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## ⚙️ Configuration & Environment

Create your local `application.properties` from `application.properties.example`:

```properties
# Database Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/doctor_appointment_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA & Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false

# Stateless JWT Secrets (HMAC-SHA256 Base64 256-bit)
jwt.expiration=900000
jwt.secretKey=your_base64_secret_key_here
jwt.refreshExpiration=604800000
jwt.refreshSecretKey=your_base64_refresh_secret_key_here

# Structured Logging
logging.level.root=INFO
logging.level.com.example.doctor_appointment_system_be=DEBUG
logging.file.name=logs/cliniq.log
```

---
