import api from "./api";
import type { SpecializationDTO, SpecializationResponseDTO } from "../types/types";


export const getAllSpecializations = async (): Promise<SpecializationResponseDTO[]> => {

    try {
        const response = await api.get("/specializations");
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching specializations:", error.message);
        throw error;
    }

};

export const createSpecialization = async (data: SpecializationDTO): Promise<SpecializationResponseDTO> => {

    try {
        const response = await api.post("/specializations", data);
        return response.data.data;
    } catch (error: any) {
        console.error("Error creating specialization:", error.message);
        throw error;
    }

};

export const updateSpecialization = async (id: number, data: SpecializationDTO): Promise<SpecializationResponseDTO> => {

    try {
        const response = await api.put(`/specializations/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        console.error("Error updating specialization:", error.message);
        throw error;
    }

};

export const deleteSpecialization = async (id: number): Promise<void> => {

    try {
        await api.delete(`/specializations/${id}`);
    } catch (error: any) {
        console.error("Error deleting specialization:", error.message);
    }

};