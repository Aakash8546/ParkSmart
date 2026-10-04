import { BASE_URL, getAuthHeaders, handleApiResponse } from './api';

export const vehicleService = {
  // 1. GET /api/vehicles/my - Fetch current user's registered vehicles
  getMyVehicles: async () => {
    const response = await fetch(`${BASE_URL}/vehicles/my`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // 2. POST /api/vehicles - Register new vehicle
  addVehicle: async ({ plateNumber, vehicleType = 'CAR', modelName = '' }) => {
    const response = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ plateNumber, vehicleType, modelName }),
    });
    return await handleApiResponse(response);
  },

  // 3. POST /api/vehicles/detect-plate - AI OCR License Plate Detection from Image
  detectPlate: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/vehicles/detect-plate`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return await handleApiResponse(response);
  },
};
