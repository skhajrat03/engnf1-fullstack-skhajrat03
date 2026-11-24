
import { useState } from 'react';
import Layout from "../../components/Layout/Layout";
import './Bookings.css';

const initialBookings = [
  {
    id: 'BK-101',
    resource: 'Conference Room A',
    date: '2026-11-25',
    time: '10:00 - 11:00',
    status: 'Confirmed',
  },
  {
    id: 'BK-102',
    resource: 'Computer Lab 1',
    date: '2026-11-26',
    time: '14:00 - 15:00',
    status: 'Pending',
  },
];

function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);

  const handleCancel = (id) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (confirmCancel) {
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );
    }
  };

  return (
    <Layout title="Bookings">
      <div className="bookings-page">
        <div className="bookings-heading">
          <h1>My Bookings</h1>
          <p>View and manage your resource booking requests.</p>
        </div>

        <div className="booking-list">
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings available.</p>
          ) : (
            bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <div className="booking-card-header">
                  <div>
                    <span className="booking-id">{booking.id}</span>
                    <h3>{booking.resource}</h3>
                  </div>

                  <span className={`booking-status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-info">
                  <p>📅 {booking.date}</p>
                  <p>◷ {booking.time}</p>
                </div>

                <button
                  className="cancel-booking"
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel Booking
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Bookings;
