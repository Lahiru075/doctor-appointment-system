import api from "./api"
import type  {DoctorSuggestion, DoctorResponseDTO, DoctorProfileUpdateDTO, DoctorRegisterDTO, DoctorUpdateDTO } from "../types/types";


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

export const getAllDoctors = async (): Promise<DoctorResponseDTO[]> => {
    const response = await api.get('/doctors'); 
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


export const toggleDoctorStatus = async (id: number): Promise<void> => {
    try{

        await api.patch(`/doctors/${id}`);
    } catch (error: any) {
        console.error("Error toggling doctor status:", error.message);
        throw error;
    }
};


export const deleteDoctor = async (id: number): Promise<void> => {
    try{
        await api.delete(`/doctors/${id}`);
    } catch (error: any) {
        console.error("Error deleting doctor:", error.message);
        throw error;
    }
};


export const registerDoctor = async (doctorData: DoctorRegisterDTO): Promise<void> => {
    try {
        await api.post('/doctors/register', doctorData); 
    } catch (error: any) {
        console.error("Error registering doctor:", error.message);
        throw error;
    }
};


export const updateDoctorByAdmin = async (
    doctorId: number, 
    doctorData: DoctorUpdateDTO
): Promise<void> => {
    try {
        await api.put(`/doctors/${doctorId}`, doctorData); 
    } catch (error: any) {
        console.error("Error updating doctor by admin:", error.message);
        throw error;
    }
};