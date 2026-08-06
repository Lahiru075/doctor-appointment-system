import api from "./api";
import type { PrescriptionRequestDTO } from "../types/types";


export const createPrescription = async (data: PrescriptionRequestDTO): Promise<void> => {
    try {
        await api.post('/prescriptions/create', data); 
    } catch (error: any) {
        console.error("Error creating prescription:", error.message);
        throw error;
    }
};