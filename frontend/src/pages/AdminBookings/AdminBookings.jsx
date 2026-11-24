
import React, { useEffect, useState } from 'react';
import {
  getAllBookings,
  updateBookingStatus,
} from '../../services/bookingService';

import './AdminBookings.css';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      if (!token) {
        throw new Error('Please log in as an administrator.');
      }

      const data = await getAllBookings(token);

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Approve or reject booking
  const handleStatusUpdate = async (bookingId, status) => {
    const adminRemarks = remarks[bookingId] || '';

    try {
      setUpdatingId(bookingId);
      setError('');
      setSuccess('');

      await updateBookingStatus(
        bookingId,
        status,
        adminRemarks,
        token
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status, adminRemarks }
            : booking
        )
      );

      setSuccess(`Booking ${status.toLowerCase()} successfully.`);

      setRemarks((prev) => ({
        ...prev,
        [bookingId]: '',
      }));
    } catch (err) {
      setError(err.message || 'Failed to update booking.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter bookings
  const filteredBookings =
    filter === 'All'
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  // Format date and time
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return <div className="admin-bookings-loading">Loading bookings...</div>;
  }

  return (
    <div className="admin-bookings-page">
      <div className="admin-bookings-header">
        <div>
          <h1>Booking Management</h1>
          <p>Manage and review resource booking requests.</p>
        </div>

        <button onClick={fetchBookings} className="refresh-btn">
          Refresh
        </button>
      </div>

      {error && <div className="booking-alert error">{error}</div>}
      {success && <div className="booking-alert success">{success}</div>}

      {/* Booking Statistics */}
      <div className="booking-summary">
        <div className="summary-card">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="summary-card">
          <h3>
            {bookings.filter((b) => b.status === 'Pending').length}
          </h3>
          <p>Pending</p>
        </div>

        <div className="summary-card">
          <h3>
            {bookings.filter((b) => b.status === 'Approved').length}
          </h3>
          <p>Approved</p>
        </div>

        <div className="summary-card">
          <h3>
            {bookings.filter((b) => b.status === 'Rejected').length}
          </h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="booking-filters">
        {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(
          (status) => (
            <button
              key={status}
              className={filter === status ? 'active' : ''}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Booking List */}
      <div className="admin-booking-list">
        {filteredBookings.length === 0 ? (
          <div className="empty-bookings">
            <h3>No bookings found</h3>
            <p>There are no bookings under this status.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div className="admin-booking-card" key={booking._id}>
              <div className="admin-booking-top">
                <div>
                  <h3>{booking.resource?.name || 'Resource unavailable'}</h3>
                  <p>
                    {booking.resource?.category || 'N/A'} ·{' '}
                    {booking.resource?.location || 'N/A'}
                  </p>
                </div>

                <span
                  className={`booking-status ${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="admin-booking-details">
                <p>
                  <strong>User:</strong>{' '}
                  {booking.user?.name || 'Unknown user'}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {booking.user?.email || 'N/A'}
                </p>

                <p>
                  <strong>Date:</strong> {formatDate(booking.startTime)}
                </p>

                <p>
                  <strong>Time:</strong>{' '}
                  {formatTime(booking.startTime)} –{' '}
                  {formatTime(booking.endTime)}
                </p>

                <p>
                  <strong>Attendees:</strong> {booking.attendees}
                </p>

                <p>
                  <strong>Purpose:</strong> {booking.purpose}
                </p>
              </div>

              {booking.status === 'Pending' && (
                <div className="admin-booking-actions">
                  <textarea
                    placeholder="Add admin remarks (optional)"
                    value={remarks[booking._id] || ''}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [booking._id]: e.target.value,
                      }))
                    }
                  />

                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      disabled={updatingId === booking._id}
                      onClick={() =>
                        handleStatusUpdate(booking._id, 'Approved')
                      }
                    >
                      {updatingId === booking._id
                        ? 'Updating...'
                        : 'Approve'}
                    </button>

                    <button
                      className="reject-btn"
                      disabled={updatingId === booking._id}
                      onClick={() =>
                        handleStatusUpdate(booking._id, 'Rejected')
                      }
                    >
                      {updatingId === booking._id
                        ? 'Updating...'
                        : 'Reject'}
                    </button>
                  </div>
                </div>
              )}

              {booking.adminRemarks && (
                <div className="admin-remarks">
                  <strong>Admin Remarks:</strong>
                  <p>{booking.adminRemarks}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
