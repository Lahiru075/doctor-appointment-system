// src/services/patient.ts
import api from "./api";
import type { PatientResponseDTO } from "../types/types";
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