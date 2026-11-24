
import React, { useState } from 'react';
import { createBooking } from '../../services/bookingService';
import './BookingForm.css';

function BookingForm({
  selectedResource,
  token,
  onBookingCreated,
  onCancel
}) {
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(
    selectedResource?.attendees || 1
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!selectedResource) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Please log in before creating a booking.');
      return;
    }

    if (!purpose.trim()) {
      setError('Please enter the purpose of your booking.');
      return;
    }

    if (!Number.isInteger(Number(attendees)) || Number(attendees) < 1) {
      setError('Please enter a valid attendee count.');
      return;
    }

    if (Number(attendees) > selectedResource.capacity) {
      setError(`Maximum capacity is ${selectedResource.capacity}.`);
      return;
    }

    try {
      setLoading(true);

      const result = await createBooking(
        {
          resourceId: selectedResource._id,
          startTime: new Date(selectedResource.startTime).toISOString(),
          endTime: new Date(selectedResource.endTime).toISOString(),
          purpose: purpose.trim(),
          attendees: Number(attendees)
        },
        token
      );

      setSuccess('Your booking has been submitted successfully!');
      onBookingCreated?.(result.booking);
    } catch (err) {
      setError(err.message || 'Unable to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <h2>Confirm Your Booking</h2>
      <p className="booking-form-subtitle">
        Review your selected resource and submit your booking.
      </p>

      <div className="selected-resource">
        <h3>{selectedResource.name}</h3>
        <p><strong>Category:</strong> {selectedResource.category}</p>
        <p><strong>Location:</strong> {selectedResource.location}</p>
        <p>
          <strong>Date:</strong>{' '}
          {new Date(selectedResource.startTime).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong>{' '}
          {new Date(selectedResource.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
          {' - '}
          {new Date(selectedResource.endTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="booking-confirmation-form">
        <div className="booking-form-field">
          <label htmlFor="booking-purpose">Booking Purpose</label>
          <textarea
            id="booking-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Enter the purpose of your booking"
            rows="3"
            required
          />
        </div>

        <div className="booking-form-field">
          <label htmlFor="booking-attendees">Number of Attendees</label>
          <input
            id="booking-attendees"
            type="number"
            min="1"
            max={selectedResource.capacity}
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            required
          />
          <small>Maximum capacity: {selectedResource.capacity}</small>
        </div>

        {error && (
          <div className="booking-form-error">{error}</div>
        )}

        {success && (
          <div className="booking-form-success">{success}</div>
        )}

        <div className="booking-form-actions">
          <button
            type="button"
            className="booking-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Back
          </button>

          <button
            type="submit"
            className="booking-submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
