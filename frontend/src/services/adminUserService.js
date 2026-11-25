
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all registered users
export const getAllUsers = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/admin/users`, {
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

// Activate or deactivate a user
export const updateUserStatus = async (userId, isActive) => {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${API_URL}/admin/users/${userId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user status');
  }

  return data.user;
};
