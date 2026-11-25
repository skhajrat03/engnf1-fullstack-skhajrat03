
import React, { useEffect, useState } from 'react';
import {
  getAllBookings,
  updateBookingStatus,
} from '../../services/bookingService';

import './AdminBookings.css';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const ITEMS_PER_PAGE = 10;

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

  const handleStatusUpdate = async (bookingId, status) => {
    const adminRemarks = remarks[bookingId] || '';

    try {
      setUpdatingId(bookingId);
      setError('');
      setSuccess('');

      await updateBookingStatus(bookingId, status, adminRemarks, token);

      setBookings((prev) =>
        prev.map((booking) =>
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

  const normalizedSearch = search.trim().toLowerCase();

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filter === 'All' || booking.status === filter;

    const matchesSearch = [
      booking.user?.name,
      booking.user?.email,
      booking.resource?.name,
      booking.purpose,
    ].some((value) =>
      String(value || '').toLowerCase().includes(normalizedSearch)
    );

    const matchesDate =
      !selectedDate ||
      (booking.startTime &&
        new Date(booking.startTime).toLocaleDateString('en-CA') === selectedDate);

    return matchesStatus && matchesSearch && matchesDate;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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

        <button onClick={fetchBookings} className="refresh-btn" type="button">
          Refresh
        </button>
      </div>

      {error && <div className="booking-alert error">{error}</div>}
      {success && <div className="booking-alert success">{success}</div>}

      <div className="booking-summary">
        <div className="summary-card">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>

        {['Pending', 'Approved', 'Rejected', 'Cancelled'].map((status) => (
          <div className="summary-card" key={status}>
            <h3>{bookings.filter((b) => b.status === status).length}</h3>
            <p>{status}</p>
          </div>
        ))}
      </div>

      <div className="booking-filters">
        {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(
          (status) => (
            <button
              key={status}
              type="button"
              className={filter === status ? 'active' : ''}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          )
        )}
      </div>

      <div className="booking-search-filters">
        <input
          type="search"
          placeholder="Search user, email, resource or purpose..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1);
          }}
        />

        <button
          type="button"
          onClick={() => {
            setSearch('');
            setSelectedDate('');
            setFilter('All');
            setCurrentPage(1);
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="admin-booking-list">
        {paginatedBookings.length === 0 ? (
          <div className="empty-bookings">
            <h3>No bookings found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          paginatedBookings.map((booking) => (
            <div className="admin-booking-card" key={booking._id}>
              <div className="admin-booking-top">
                <div>
                  <h3>{booking.resource?.name || 'Resource unavailable'}</h3>
                  <p>
                    {booking.resource?.category || 'N/A'} ·{' '}
                    {booking.resource?.location || 'N/A'}
                  </p>
                </div>

                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>

              <div className="admin-booking-details">
                <p><strong>User:</strong> {booking.user?.name || 'Unknown user'}</p>
                <p><strong>Email:</strong> {booking.user?.email || 'N/A'}</p>
                <p><strong>Date:</strong> {formatDate(booking.startTime)}</p>
                <p>
                  <strong>Time:</strong> {formatTime(booking.startTime)} –{' '}
                  {formatTime(booking.endTime)}
                </p>
                <p><strong>Attendees:</strong> {booking.attendees}</p>
                <p><strong>Purpose:</strong> {booking.purpose}</p>
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
                      type="button"
                      className="approve-btn"
                      disabled={updatingId === booking._id}
                      onClick={() => handleStatusUpdate(booking._id, 'Approved')}
                    >
                      {updatingId === booking._id ? 'Updating...' : 'Approve'}
                    </button>

                    <button
                      type="button"
                      className="reject-btn"
                      disabled={updatingId === booking._id}
                      onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                    >
                      {updatingId === booking._id ? 'Updating...' : 'Reject'}
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

      {filteredBookings.length > 0 && (
        <div className="booking-pagination">
          <span>
            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}
          </span>

          <div>
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>

            <span>Page {safePage} of {totalPages}</span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
