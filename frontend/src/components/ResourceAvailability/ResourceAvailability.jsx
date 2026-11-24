
import React, { useState } from 'react';
import { getAvailableResources } from '../../services/resourceService';
import './ResourceAvailability.css';

function ResourceAvailability({ onSelectResource }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [category, setCategory] = useState('');

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const today = new Date().toLocaleDateString('en-CA');

  const handleSearch = async (e) => {
    e.preventDefault();

    setError('');
    setResources([]);
    setSearched(false);

    if (!date || !startTime || !endTime) {
      setError('Please select a date, start time and end time.');
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (start <= new Date()) {
      setError('Please select a future start time.');
      return;
    }

    if (end <= start) {
      setError('End time must be later than start time.');
      return;
    }

    try {
      setLoading(true);

      const result = await getAvailableResources({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        attendees,
        category
      });

      setResources(result.resources || []);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Unable to search resources.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="availability-container">
      <div className="availability-header">
        <h2>Find Available Resources</h2>
        <p>Choose your preferred date and time to find resources.</p>
      </div>

      <form onSubmit={handleSearch} className="availability-form">
        <div className="availability-fields">

          <div className="availability-field">
            <label htmlFor="booking-date">Date</label>
            <input
              id="booking-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="availability-field">
            <label htmlFor="start-time">Start Time</label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="availability-field">
            <label htmlFor="end-time">End Time</label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="availability-field">
            <label htmlFor="attendees">Attendees</label>
            <input
              id="attendees"
              type="number"
              min="1"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              required
            />
          </div>

          <div className="availability-field">
            <label htmlFor="resource-category">Category</label>
            <select
              id="resource-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Conference Room">Conference Room</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Equipment">Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          className="availability-search-btn"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Availability'}
        </button>
      </form>

      {error && (
        <div className="availability-error">
          {error}
        </div>
      )}

      {searched && (
        <div className="availability-results">
          <h3>Available Resources ({resources.length})</h3>

          {resources.length === 0 ? (
            <p className="availability-empty">
              No resources are available for your selected time.
            </p>
          ) : (
            <div className="resource-grid">
              {resources.map((resource) => (
                <div className="resource-card" key={resource._id}>
                  {resource.image && (
                    <img
                      src={resource.image}
                      alt={resource.name}
                      className="resource-image"
                    />
                  )}

                  <div className="resource-card-content">
                    <h3>{resource.name}</h3>

                    <p>{resource.description}</p>

                    <p>
                      <strong>Category:</strong> {resource.category}
                    </p>

                    <p>
                      <strong>Location:</strong> {resource.location}
                    </p>

                    <p>
                      <strong>Capacity:</strong> {resource.capacity}
                    </p>

                    <p>
                      <strong>Facilities:</strong>{' '}
                      {resource.facilities?.length
                        ? resource.facilities.join(', ')
                        : 'Not specified'}
                    </p>

                    <button
                      type="button"
                      className="select-resource-btn"
                      onClick={() => onSelectResource?.({
                        ...resource,
                        startTime: `${date}T${startTime}`,
                        endTime: `${date}T${endTime}`,
                        attendees: Number(attendees)
                      })}
                    >
                      Select Resource
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ResourceAvailability;
