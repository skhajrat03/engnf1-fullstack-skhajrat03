
import React, { useEffect, useState } from 'react';
import {
  getMyBookings,
  cancelBooking
} from '../../services/bookingService';

import './MyBookings.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      if (!token) {
        setError('Please log in to view your bookings.');
        return;
      }

      const result = await getMyBookings(token);
      setBookings(result.bookings || []);
    } catch (err) {
      setError(err.message || 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);
      setError('');
      setMessage('');

      await cancelBooking(bookingId, token);

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'Cancelled' }
            : booking
        )
      );

      setMessage('Booking cancelled successfully.');
    } catch (err) {
      setError(err.message || 'Unable to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusClass = (status) => {
    return `booking-status status-${status?.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="my-bookings-container">
        <p className="booking-loading">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <div className="my-bookings-header">
        <div>
          <h2>My Bookings</h2>
          <p>Manage and track your resource bookings.</p>
        </div>

        <button
          className="refresh-bookings-btn"
          onClick={fetchBookings}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="booking-alert booking-alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="booking-alert booking-alert-success">
          {message}
        </div>
      )}

      <div className="booking-summary">
        <div className="booking-summary-card">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="booking-summary-card">
          <h3>
            {bookings.filter((b) => b.status === 'Pending').length}
          </h3>
          <p>Pending</p>
        </div>

        <div className="booking-summary-card">
          <h3>
            {bookings.filter((b) => b.status === 'Approved').length}
          </h3>
          <p>Approved</p>
        </div>

        <div className="booking-summary-card">
          <h3>
            {bookings.filter((b) => b.status === 'Cancelled').length}
          </h3>
          <p>Cancelled</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No bookings found</h3>
          <p>You haven't made any resource bookings yet.</p>
        </div>
      ) : (
        <div className="my-bookings-list">
          {bookings.map((booking) => (
            <div className="my-booking-card" key={booking._id}>
              <div className="my-booking-top">
                <div>
                  <h3>
                    {booking.resource?.name || 'Resource unavailable'}
                  </h3>
                  <p className="booking-category">
                    {booking.resource?.category || 'Unknown category'}
                  </p>
                </div>

                <span className={getStatusClass(booking.status)}>
                  {booking.status}
                </span>
              </div>

              <div className="my-booking-details">
                <p>
                  <strong>Location:</strong>{' '}
                  {booking.resource?.location || 'Not available'}
                </p>

                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(booking.startTime).toLocaleDateString()}
                </p>

                <p>
                  <strong>Start:</strong>{' '}
                  {new Date(booking.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                <p>
                  <strong>End:</strong>{' '}
                  {new Date(booking.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                <p>
                  <strong>Purpose:</strong> {booking.purpose}
                </p>

                <p>
                  <strong>Attendees:</strong> {booking.attendees}
                </p>

                {booking.adminRemarks && (
                  <p>
                    <strong>Admin Remarks:</strong>{' '}
                    {booking.adminRemarks}
                  </p>
                )}
              </div>

              {['Pending', 'Approved'].includes(booking.status) && (
                <div className="my-booking-actions">
                  <button
                    className="cancel-booking-btn"
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                  >
                    {cancellingId === booking._id
                      ? 'Cancelling...'
                      : 'Cancel Booking'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
