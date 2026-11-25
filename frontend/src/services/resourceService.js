
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all resources
export const getAllResources = async () => {
  const response = await fetch(`${API_URL}/resources`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch resources');
  }

  return data;
};

// Get resource by ID
export const getResourceById = async (resourceId) => {
  const response = await fetch(`${API_URL}/resources/${resourceId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch resource');
  }

  return data;
};

// Get available resources for a time slot
export const getAvailableResources = async ({
  startTime,
  endTime,
  attendees,
  category,
}) => {
  const params = new URLSearchParams({
    startTime,
    endTime,
  });

  if (attendees) params.append('attendees', attendees);
  if (category) params.append('category', category);

  const response = await fetch(
    `${API_URL}/resources/availability?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch available resources');
  }

  return data;
};

// Create resource (Admin only)
export const createResource = async (resourceData, token) => {
  const response = await fetch(`${API_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resourceData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create resource');
  }

  return data;
};

// Update resource (Admin only)
export const updateResource = async (resourceId, resourceData, token) => {
  const response = await fetch(`${API_URL}/resources/${resourceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resourceData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update resource');
  }

  return data;
};

// Delete resource (Admin only)
export const deleteResource = async (resourceId, token) => {
  const response = await fetch(`${API_URL}/resources/${resourceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete resource');
  }

  return data;
};
