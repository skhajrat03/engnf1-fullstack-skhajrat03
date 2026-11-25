
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fetch admin dashboard statistics
export const getAdminStats = async (token) => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch admin statistics');
  }

  return data.stats;
};
