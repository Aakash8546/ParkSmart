import { BASE_URL, getAuthHeaders, handleApiResponse } from './api';

export const adminService = {
  // 1. GET /api/admin/stats
  getDashboardStats: async () => {
    const response = await fetch(`${BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // 2. GET /api/admin/bookings
  getAllBookings: async () => {
    const response = await fetch(`${BASE_URL}/admin/bookings`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // 3. GET /api/admin/export (CSV file download)
  exportCsvUrl: () => `${BASE_URL}/admin/export`,
};
