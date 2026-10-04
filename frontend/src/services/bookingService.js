import { BASE_URL, getAuthHeaders, handleApiResponse } from './api';

export const bookingService = {
  // 1. POST /api/bookings - Create new booking
  createBooking: async ({ slotId, vehicleId, startTime, endTime }) => {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ slotId, vehicleId, startTime, endTime }),
    });
    return await handleApiResponse(response);
  },

  // 2. GET /api/bookings/my - Get all user bookings
  getMyBookings: async () => {
    const response = await fetch(`${BASE_URL}/bookings/my`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // 3. GET /api/bookings/{id} - Get single booking detail
  getBookingById: async (id) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // 4. PUT /api/bookings/{id}/cancel - Cancel booking
  cancelBooking: async (id) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // 5. Get QR Code URL for direct img src
  getQrCodeUrl: (id) => `${BASE_URL}/bookings/${id}/qr`,
};
