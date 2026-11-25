
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all registered users (Admin only)
export const getAllUsers = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }

  return data.users;
};
