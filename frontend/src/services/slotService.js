const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const slotService = {
  // 1. GET /api/slots - Get All Parking Slots
  getAllSlots: async () => {
    try {
      const response = await fetch(`${BASE_URL}/slots`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Parking Slots API connection offline, using simulated slots feed:', error);
      return null;
    }
  },

  // 2. GET /api/slots/{id} - Get Slot Details By ID
  getSlotById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/slots/${id}`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`Slot ID ${id} API offline:`, error);
      return null;
    }
  },
};
