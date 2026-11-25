
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get logged-in user's bookings
export const getMyBookings = async () => {
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
    throw new Error(data.message || 'Failed to fetch bookings');
  }

  return Array.isArray(data)
    ? data
    : data.bookings || [];
};

// Cancel a booking
export const cancelMyBooking = async (bookingId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Please log in to continue.');
  }

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/cancel`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to cancel booking');
  }

  return data.booking;
};
