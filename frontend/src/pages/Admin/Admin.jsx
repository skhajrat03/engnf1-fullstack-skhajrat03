
import React from "react";
import "./Admin.css";

const Admin = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,250",
      icon: "👥",
      color: "#e8f0ff",
    },
    {
      title: "Total Doctors",
      value: "48",
      icon: "🩺",
      color: "#e6f8f1",
    },
    {
      title: "Total Bookings",
      value: "320",
      icon: "📅",
      color: "#fff3e5",
    },
    {
      title: "Pending Bookings",
      value: "24",
      icon: "⏳",
      color: "#fcebed",
    },
  ];

  const bookings = [
    {
      id: "#BK001",
      patient: "Rahul Sharma",
      doctor: "Dr. Amit",
      date: "24 Nov 2026",
      status: "Confirmed",
    },
    {
      id: "#BK002",
      patient: "Priya Das",
      doctor: "Dr. Sneha",
      date: "25 Nov 2026",
      status: "Pending",
    },
    {
      id: "#BK003",
      patient: "Arjun Roy",
      doctor: "Dr. Raj",
      date: "26 Nov 2026",
      status: "Cancelled",
    },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">TriageSync</h2>

        <nav>
          <a href="#dashboard" className="active">Dashboard</a>
          <a href="#users">Users</a>
          <a href="#doctors">Doctors</a>
          <a href="#bookings">Bookings</a>
          <a href="#settings">Settings</a>
        </nav>

        <button className="admin-logout">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, Admin!</p>
          </div>

          <div className="admin-profile">
            <span>👤</span>
            <div>
              <strong>Administrator</strong>
              <small>Admin</small>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section className="admin-stats">
          {stats.map((item, index) => (
            <div className="admin-stat-card" key={index}>
              <div
                className="stat-icon"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>

              <div>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Bookings */}
        <section className="admin-bookings" id="bookings">
          <div className="section-heading">
            <h2>Recent Bookings</h2>
            <button>View All</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.patient}</td>
                    <td>{booking.doctor}</td>
                    <td>{booking.date}</td>
                    <td>
                      <span
                        className={`status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
