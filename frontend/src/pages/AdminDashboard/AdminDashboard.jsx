
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
        { title: 'Total Users', value: stats.totalUsers ?? 0, icon: '👥', color: 'blue' },
        { title: 'Total Admins', value: stats.totalAdmins ?? 0, icon: '🛡️', color: 'purple' },
        { title: 'Total Resources', value: stats.totalResources ?? 0, icon: '🏢', color: 'indigo' },
        { title: 'Available Resources', value: stats.availableResources ?? 0, icon: '✅', color: 'green' },
        { title: 'Unavailable Resources', value: stats.unavailableResources ?? 0, icon: '🔧', color: 'orange' },
        { title: 'Total Bookings', value: stats.totalBookings ?? 0, icon: '📅', color: 'blue' },
        { title: 'Pending Bookings', value: stats.pendingBookings ?? 0, icon: '⏳', color: 'orange' },
        { title: 'Approved Bookings', value: stats.approvedBookings ?? 0, icon: '✔️', color: 'green' },
        { title: 'Rejected Bookings', value: stats.rejectedBookings ?? 0, icon: '❌', color: 'red' },
        { title: 'Cancelled Bookings', value: stats.cancelledBookings ?? 0, icon: '↩️', color: 'gray' },
      ]
    : [];

  const bookingStatuses = stats
    ? [
        { label: 'Pending', value: stats.pendingBookings ?? 0, color: '#f59e0b' },
        { label: 'Approved', value: stats.approvedBookings ?? 0, color: '#16a34a' },
        { label: 'Rejected', value: stats.rejectedBookings ?? 0, color: '#dc2626' },
        { label: 'Cancelled', value: stats.cancelledBookings ?? 0, color: '#64748b' },
      ]
    : [];

  const totalBookings = stats?.totalBookings ?? 0;

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
          type="button"
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
          <button onClick={fetchStats} type="button">Try again</button>
        </div>
      )}

      {stats && (
        <>
          <section className="dashboard-section">
            <h2>System Overview</h2>
            <div className="admin-stat-grid">
              {statCards.slice(0, 5).map((card) => (
                <div className={`admin-stat-card ${card.color}`} key={card.title}>
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
                <div className={`admin-stat-card ${card.color}`} key={card.title}>
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
            <h2>Booking Status Distribution</h2>

            <div className="booking-distribution">
              {bookingStatuses.map((item) => {
                const percentage = totalBookings > 0
                  ? (item.value / totalBookings) * 100
                  : 0;

                return (
                  <div className="distribution-item" key={item.label}>
                    <div className="distribution-info">
                      <span>{item.label}</span>
                      <strong>{item.value} ({percentage.toFixed(1)}%)</strong>
                    </div>

                    <div className="distribution-track">
                      <div
                        className="distribution-fill"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
