
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fetch logged-in user's bookings
export const getDashboardData = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Please log in to continue.');
  }

  const response = await fetch(`${API_URL}/bookings/my-bookings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch dashboard data');
  }

  // Support either an array or an object containing bookings
  const bookings = Array.isArray(data)
    ? data
    : data.bookings || [];

  const stats = {
    total: bookings.length,
    pending: bookings.filter(
      (booking) => booking.status === 'Pending'
    ).length,
    approved: bookings.filter(
      (booking) => booking.status === 'Approved'
    ).length,
    rejected: bookings.filter(
      (booking) => booking.status === 'Rejected'
    ).length,
    cancelled: bookings.filter(
      (booking) => booking.status === 'Cancelled'
    ).length,
  };

  return { bookings, stats };
};
