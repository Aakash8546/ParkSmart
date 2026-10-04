import { BASE_URL, getAuthHeaders, handleApiResponse } from './api';

export const slotService = {
  // 1. GET /api/slots - Fetch all parking slots from backend database
  getAllSlots: async () => {
    const response = await fetch(`${BASE_URL}/slots`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // 2. GET /api/slots/{id} - Fetch single slot detail
  getSlotById: async (id) => {
    const response = await fetch(`${BASE_URL}/slots/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },
};
