
import React, { useEffect, useMemo, useState } from 'react';
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from '../../services/resourceService';

import './AdminResources.css';

const initialForm = {
  name: '',
  description: '',
  category: 'Conference Room',
  location: '',
  capacity: 1,
  facilities: '',
  image: '',
  status: 'Available',
};

const categories = [
  'Conference Room',
  'Computer Lab',
  'Meeting Room',
  'Equipment',
  'Other',
];

function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllResources();
      const resourceList = Array.isArray(data)
        ? data
        : data.resources || [];

      setResources(resourceList);
    } catch (err) {
      setError(err.message || 'Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        resource.name?.toLowerCase().includes(searchText) ||
        resource.location?.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === 'All' ||
        resource.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [resources, search, categoryFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEditForm = (resource) => {
    setEditingId(resource._id);

    setForm({
      name: resource.name || '',
      description: resource.description || '',
      category: resource.category || 'Other',
      location: resource.location || '',
      capacity: resource.capacity || 1,
      facilities: (resource.facilities || []).join(', '),
      image: resource.image || '',
      status: resource.status || 'Available',
    });

    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Please log in as an administrator.');
      return;
    }

    const resourceData = {
      ...form,
      capacity: Number(form.capacity),
      facilities: form.facilities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (editingId) {
        await updateResource(editingId, resourceData, token);
        setSuccess('Resource updated successfully.');
      } else {
        await createResource(resourceData, token);
        setSuccess('Resource created successfully.');
      }

      closeForm();
      await fetchResources();
    } catch (err) {
      setError(err.message || 'Failed to save resource.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resourceId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resource?'
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await deleteResource(resourceId, token);

      setResources((prev) =>
        prev.filter((resource) => resource._id !== resourceId)
      );

      setSuccess('Resource deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete resource.');
    }
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() || 'available';
  };

  return (
    <div className="admin-resources-page">
      <div className="resources-header">
        <div>
          <h1>Resource Management</h1>
          <p>Add, update, search and manage system resources.</p>
        </div>

        <button className="add-resource-btn" onClick={openAddForm}>
          + Add Resource
        </button>
      </div>

      {error && <div className="resource-alert error">{error}</div>}
      {success && <div className="resource-alert success">{success}</div>}

      <div className="resource-toolbar">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button onClick={fetchResources} className="resource-refresh-btn">
          Refresh
        </button>
      </div>

      <div className="resource-count">
        Showing {filteredResources.length} of {resources.length} resources
      </div>

      {loading ? (
        <div className="resource-loading">Loading resources...</div>
      ) : filteredResources.length === 0 ? (
        <div className="resource-empty">
          <h3>No resources found</h3>
          <p>Add a resource or change your search filters.</p>
        </div>
      ) : (
        <div className="admin-resource-grid">
          {filteredResources.map((resource) => (
            <div className="admin-resource-card" key={resource._id}>
              {resource.image ? (
                <img
                  className="resource-image"
                  src={resource.image}
                  alt={resource.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="resource-image-placeholder">🏢</div>
              )}

              <div className="resource-card-content">
                <div className="resource-card-heading">
                  <h3>{resource.name}</h3>
                  <span
                    className={`resource-status ${getStatusClass(
                      resource.status
                    )}`}
                  >
                    {resource.status}
                  </span>
                </div>

                <p className="resource-category">{resource.category}</p>
                <p className="resource-description">
                  {resource.description || 'No description available.'}
                </p>

                <div className="resource-info">
                  <p><strong>Location:</strong> {resource.location}</p>
                  <p><strong>Capacity:</strong> {resource.capacity}</p>
                  <p>
                    <strong>Facilities:</strong>{' '}
                    {resource.facilities?.length
                      ? resource.facilities.join(', ')
                      : 'Not specified'}
                  </p>
                </div>

                <div className="resource-card-actions">
                  <button
                    className="edit-resource-btn"
                    onClick={() => openEditForm(resource)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-resource-btn"
                    onClick={() => handleDelete(resource._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="resource-modal-overlay">
          <div className="resource-modal">
            <div className="resource-modal-header">
              <h2>{editingId ? 'Edit Resource' : 'Add New Resource'}</h2>
              <button type="button" onClick={closeForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Resource Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter resource name"
              />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this resource"
              />

              <label>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label>Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
              />

              <label>Capacity *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                required
              />

              <label>Facilities</label>
              <input
                name="facilities"
                value={form.facilities}
                onChange={handleChange}
                placeholder="Projector, Wi-Fi, AC (comma separated)"
              />

              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <div className="resource-modal-actions">
                <button
                  type="button"
                  className="resource-cancel-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="resource-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Resource'
                      : 'Create Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResources;
