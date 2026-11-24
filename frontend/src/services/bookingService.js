
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a new booking
export const createBooking = async (bookingData, token) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create booking');
    }

    return data;
  } catch (error) {
    console.error('Create Booking Error:', error);
    throw error;
  }
};

// Get logged-in user's bookings
export const getMyBookings = async (token) => {
  try {
    const response = await fetch(
      `${API_URL}/bookings/my-bookings`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bookings');
    }

    return data;
  } catch (error) {
    console.error('Get Bookings Error:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/bookings/${bookingId}/cancel`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel booking');
    }

    return data;
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    throw error;
  }
};

// Get all bookings (Admin only)
export const getAllBookings = async (token) => {
  const response = await fetch(`${API_URL}/bookings/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch all bookings');
  }

  return data;
};

// Approve or reject a booking (Admin only)
export const updateBookingStatus = async (
  bookingId,
  status,
  adminRemarks,
  token
) => {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        adminRemarks,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update booking status');
  }

  return data;
};
