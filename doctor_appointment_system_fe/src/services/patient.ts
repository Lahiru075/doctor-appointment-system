// src/services/patient.ts
import api from "./api";
import type { PatientResponseDTO, PasswordChangeDTO, PatientUpdateDTO } from "../types/types";
import { tr } from "motion/react-m";

export const getAllPatients = async (): Promise<PatientResponseDTO[]> => {
    const response = await api.get('/patients');
    return response.data.data;
};

export const togglePatientStatus = async (id: number): Promise<void> => {

    try {
        await api.patch(`/patients/${id}`);
    } catch (error: any) {
        console.error('Error toggling patient status:', error.message);
    }

};

export const deletePatient = async (id: number): Promise<void> => {

    try {
        await api.delete(`/patients/${id}`);
    } catch (error: any) {
        console.error('Error deleting patient:', error.message);
    }
};

export const changePatientPassword = async (userId: number, data: PasswordChangeDTO): Promise<void> => {

    try {
        await api.put(`/patients/change-password/${userId}`, data);
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to change password";
    }
};


export const updatePatientProfile = async (userId: number, data: PatientUpdateDTO): Promise<void> => {
    try {
        await api.put(`/patients/profile-update/${userId}`, data);
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to update profile";
    }
};

export const getPatientProfile = async (userId: number): Promise<PatientResponseDTO> => {
    try {
        const response = await api.get(`/patients/profile/${userId}`);
        return response.data.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Failed to load profile";
    }
};