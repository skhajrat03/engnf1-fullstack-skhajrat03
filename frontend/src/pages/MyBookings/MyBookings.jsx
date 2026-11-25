
import React, { useEffect, useMemo, useState } from 'react';

import Layout from '../../components/Layout/Layout';

import {
  getMyBookings,
  cancelMyBooking,
} from '../../services/myBookingService';

import './MyBookings.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
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
      setUpdatingId(bookingId);
      setError('');
      setSuccess('');

      const updatedBooking = await cancelMyBooking(bookingId);

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, ...updatedBooking }
            : booking
        )
      );

      setSuccess('Booking cancelled successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const resourceName =
        typeof booking.resource === 'object'
          ? booking.resource?.name || ''
          : '';

      const searchText = search.toLowerCase();

      const matchesSearch =
        resourceName.toLowerCase().includes(searchText) ||
        booking.purpose?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === 'all' ||
        booking.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleString();
  };

  return (
    <Layout title="My Bookings">
      <div className="my-bookings">

        <div className="my-bookings-header">
          <div>
            <h1>My Bookings</h1>
            <p>View and manage your resource bookings.</p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="booking-refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="booking-filters">
          <input
            type="text"
            placeholder="Search resource or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && (
          <div className="booking-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="booking-message success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="booking-empty">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="booking-empty">
            <h3>No bookings found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="my-booking-list">
            {filteredBookings.map((booking) => {
              const resourceName =
                typeof booking.resource === 'object'
                  ? booking.resource?.name
                  : null;

              const canCancel = ['pending', 'approved'].includes(
                booking.status?.toLowerCase()
              );

              return (
                <div className="my-booking-card" key={booking._id}>
                  <div className="my-booking-card-header">
                    <div>
                      <h3>{resourceName || 'Resource Booking'}</h3>
                      <p>{booking.purpose}</p>
                    </div>

                    <span
                      className={`my-booking-status ${booking.status?.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="my-booking-details">
                    <p>
                      <strong>Start:</strong>{' '}
                      {formatDate(booking.startTime)}
                    </p>

                    <p>
                      <strong>End:</strong>{' '}
                      {formatDate(booking.endTime)}
                    </p>

                    <p>
                      <strong>Attendees:</strong>{' '}
                      {booking.attendees}
                    </p>

                    {booking.adminRemarks && (
                      <p>
                        <strong>Admin Remarks:</strong>{' '}
                        {booking.adminRemarks}
                      </p>
                    )}
                  </div>

                  {canCancel && (
                    <button
                      type="button"
                      className="cancel-booking-btn"
                      disabled={updatingId === booking._id}
                      onClick={() => handleCancel(booking._id)}
                    >
                      {updatingId === booking._id
                        ? 'Cancelling...'
                        : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && (
          <p className="booking-results-count">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        )}
      </div>
    </Layout>
  );
}

export default MyBookings;
