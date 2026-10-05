import { BASE_URL, getAuthHeaders, handleApiResponse } from './api';

const ML_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5001';

export const mlService = {
  // 1. GET /predict-demand (ML Flask service or Spring proxy)
  predictDemand: async () => {
    try {
      const response = await fetch(`${ML_BASE_URL}/predict-demand`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Fallback if local ML service is unreachable
    }

    try {
      const response = await fetch(`${BASE_URL}/ml/predict-demand`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (e) {
      return null;
    }
  },
};
