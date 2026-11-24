
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Check available resources
export const getAvailableResources = async ({
  startTime,
  endTime,
  attendees,
  category
}) => {
  try {
    const params = new URLSearchParams({
      startTime,
      endTime
    });

    if (attendees) {
      params.append('attendees', attendees);
    }

    if (category) {
      params.append('category', category);
    }

    const response = await fetch(
      `${API_URL}/resources/availability?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch resources');
    }

    return data;
  } catch (error) {
    console.error('Resource Availability Error:', error);
    throw error;
  }
};

// Get all resources
export const getAllResources = async () => {
  try {
    const response = await fetch(`${API_URL}/resources`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch resources');
    }

    return data;
  } catch (error) {
    console.error('Get Resources Error:', error);
    throw error;
  }
};
