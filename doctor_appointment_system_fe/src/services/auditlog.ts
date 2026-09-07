import api from './api'; 
import type { AuditLog } from '../types/types';

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export const getAllAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await api.get<ApiResponse<AuditLog[]>>('/admin/audit-logs');
  return response.data.data;
};