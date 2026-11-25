
import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/adminService';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Please log in as an administrator.');
      }

      const data = await getAdminStats(token);
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        {
          title: 'Total Users',
          value: stats.totalUsers,
          icon: '👥',
          color: 'blue',
        },
        {
          title: 'Total Admins',
          value: stats.totalAdmins,
          icon: '🛡️',
          color: 'purple',
        },
        {
          title: 'Total Resources',
          value: stats.totalResources,
          icon: '🏢',
          color: 'indigo',
        },
        {
          title: 'Available Resources',
          value: stats.availableResources,
          icon: '✅',
          color: 'green',
        },
        {
          title: 'Unavailable Resources',
          value: stats.unavailableResources,
          icon: '🔧',
          color: 'orange',
        },
        {
          title: 'Total Bookings',
          value: stats.totalBookings,
          icon: '📅',
          color: 'blue',
        },
        {
          title: 'Pending Bookings',
          value: stats.pendingBookings,
          icon: '⏳',
          color: 'orange',
        },
        {
          title: 'Approved Bookings',
          value: stats.approvedBookings,
          icon: '✔️',
          color: 'green',
        },
        {
          title: 'Rejected Bookings',
          value: stats.rejectedBookings,
          icon: '❌',
          color: 'red',
        },
        {
          title: 'Cancelled Bookings',
          value: stats.cancelledBookings,
          icon: '↩️',
          color: 'gray',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        Loading dashboard statistics...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of your resource booking system.</p>
        </div>

        <button
          className="dashboard-refresh-btn"
          onClick={fetchStats}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
          <button onClick={fetchStats}>Try again</button>
        </div>
      )}

      {stats && (
        <>
          <section className="dashboard-section">
            <h2>System Overview</h2>

            <div className="admin-stat-grid">
              {statCards.slice(0, 5).map((card) => (
                <div
                  className={`admin-stat-card ${card.color}`}
                  key={card.title}
                >
                  <div className="admin-stat-icon">{card.icon}</div>
                  <div>
                    <p>{card.title}</p>
                    <h3>{card.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Booking Overview</h2>

            <div className="admin-stat-grid">
              {statCards.slice(5).map((card) => (
                <div
                  className={`admin-stat-card ${card.color}`}
                  key={card.title}
                >
                  <div className="admin-stat-icon">{card.icon}</div>
                  <div>
                    <p>{card.title}</p>
                    <h3>{card.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
