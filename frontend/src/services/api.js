export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const handleApiResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};
