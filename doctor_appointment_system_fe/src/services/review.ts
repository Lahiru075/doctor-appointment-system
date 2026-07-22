import api from "./api"
import type { ReviewRequestDTO } from "../types/types";

export const addReview = async (reviewRequest: ReviewRequestDTO): Promise<void> => {
    try {
        await api.post('/reviews/add', reviewRequest); 
    } catch (error: any) {
        console.error("Error submitting review:", error.message);
        throw error;
    }
};