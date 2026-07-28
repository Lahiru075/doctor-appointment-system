import api from "./api";
import type { AdminDashboardDTO } from "../types/types";

export const getAdminDashboardStats = async (): Promise<AdminDashboardDTO> => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data.data;
};