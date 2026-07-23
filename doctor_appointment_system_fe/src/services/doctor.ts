import api from "./api"
import type  {DoctorSuggestion, DoctorResponseDTO, DoctorProfileUpdateDTO } from "../types/types";


export const getDoctorSuggestions = async (query: string): Promise<DoctorSuggestion[]> => {
    const response = await api.get(`/doctors/suggestions`, {
        params: { query }
    });
    return response.data.data;
};

export const searchDoctors = async (name?: string, specializationId?: number | ''): Promise<DoctorResponseDTO[]> => {
    const params: any = {};
    if (name) params.name = name;
    if (specializationId) params.specializationId = specializationId;

    const response = await api.get(`/doctors/search`, { params });
    return response.data.data;
};

export const updateDoctorProfile = async (
    userId: number, 
    profileData: DoctorProfileUpdateDTO
): Promise<DoctorResponseDTO> => {
    try {
        const response = await api.put(`/doctors/profile/${userId}`, profileData);
        return response.data.data; 
    } catch (error: any) {
        console.error("Error updating doctor profile:", error.message);
        throw error;
    }
};

export const getDoctorProfile = async (userId: number): Promise<DoctorResponseDTO> => {
    try {
        const response = await api.get(`/doctors/profile/${userId}`);
        return response.data.data; 
    } catch (error: any) {
        console.error("Error fetching doctor profile:", error.message);
        throw error;
    }
};