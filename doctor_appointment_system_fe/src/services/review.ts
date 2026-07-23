import api from "./api"
import type { ReviewRequestDTO, ReviewResponseDTO } from "../types/types";

export const addReview = async (reviewRequest: ReviewRequestDTO): Promise<void> => {
    try {
        await api.post('/reviews/add', reviewRequest); 
    } catch (error: any) {
        console.error("Error submitting review:", error.message);
        throw error;
    }
};

export const getDoctorReviews = async (doctorId: number): Promise<ReviewResponseDTO[]> => {
    try {
        const response = await api.get(`/reviews/doctor/${doctorId}`);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching doctor reviews:", error.message);
        throw error;
    }
};

export const getDoctorOwnReviews = async (userId: number): Promise<ReviewResponseDTO[]> => {
    try {
        const response = await api.get(`/reviews/doctor-reviews/${userId}`);
        return response.data.data; 
    } catch (error: any) {
        console.error("Error fetching doctor's own reviews:", error.message);
        throw error;
    }
};