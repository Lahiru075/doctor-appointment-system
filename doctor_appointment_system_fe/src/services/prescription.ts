import api from "./api";
import type { PrescriptionRequestDTO, PrescriptionResponseDTO } from "../types/types";


export const createPrescription = async (data: PrescriptionRequestDTO): Promise<void> => {
    try {
        await api.post('/prescriptions/create', data); 
    } catch (error: any) {
        console.error("Error creating prescription:", error.message);
        throw error;
    }
};

export const getPatientPrescriptions = async (userId: number): Promise<PrescriptionResponseDTO[]> => {
    try {
        const response = await api.get(`/prescriptions/patient/${userId}`);
        return response.data.data; 
    } catch (error: any) {
        console.error("Error fetching prescriptions:", error.message);
        throw error;
    }
};