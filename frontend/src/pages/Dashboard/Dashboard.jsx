
import React, { useEffect, useState } from 'react';

import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/StatCard/StatCard';
import { getDashboardData } from '../../services/dashboardService';

import './Dashboard.css';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getDashboardData();

        setBookings(data.bookings);
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.startTime) -
        new Date(a.createdAt || a.startTime)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleString();
  };

  return (
    <Layout title="Dashboard">
      <div className="dashboard">

        <div className="dashboard-welcome">
          <h1>Overview</h1>
          <p>Monitor your resource bookings and activity.</p>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Booking Statistics */}
            <div className="dashboard-stats">
              <StatCard
                title="Total Bookings"
                value={stats.total}
                subtitle="All bookings"
                icon="▤"
              />

              <StatCard
                title="Pending"
                value={stats.pending}
                subtitle="Awaiting approval"
                icon="◷"
              />

              <StatCard
                title="Approved"
                value={stats.approved}
                subtitle="Confirmed bookings"
                icon="✓"
              />

              <StatCard
                title="Cancelled"
                value={stats.cancelled}
                subtitle="Cancelled bookings"
                icon="✕"
              />
            </div>

            {/* Additional Statistics */}
            <div className="dashboard-extra-stats">
              <div className="extra-stat">
                <span>Rejected Bookings</span>
                <strong>{stats.rejected}</strong>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="dashboard-section">
              <div className="section-heading">
                <h2>Recent Bookings</h2>
                <span>{bookings.length} total</span>
              </div>

              {recentBookings.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No bookings yet</h3>
                  <p>Your recent bookings will appear here.</p>
                </div>
              ) : (
                <div className="recent-booking-list">
                  {recentBookings.map((booking) => {
                    const resourceName =
                      typeof booking.resource === 'object'
                        ? booking.resource?.name
                        : null;

                    return (
                      <div
                        className="booking-card"
                        key={booking._id}
                      >
                        <div className="booking-card-header">
                          <div>
                            <h3>
                              {resourceName || 'Resource Booking'}
                            </h3>

                            <p>{booking.purpose}</p>
                          </div>

                          <span
                            className={`booking-status ${booking.status?.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="booking-card-details">
                          <span>
                            <strong>Start:</strong>{' '}
                            {formatDate(booking.startTime)}
                          </span>

                          <span>
                            <strong>End:</strong>{' '}
                            {formatDate(booking.endTime)}
                          </span>

                          <span>
                            <strong>Attendees:</strong>{' '}
                            {booking.attendees}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
