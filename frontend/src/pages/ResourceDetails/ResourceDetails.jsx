
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import './ResourceDetails.css'

function ResourceDetails() {
  const { id } = useParams()

  return (
    <Layout title="Resource Details">
      <div className="resource-details-page">
        <Link to="/resources" className="resource-back-link">
          ← Back to Resources
        </Link>

        <div className="resource-details-card">
          <span className="resource-details-icon">▣</span>
          <h1>Resource Details</h1>
          <p className="resource-id">Resource ID: {id}</p>

          <div className="resource-info">
            <div>
              <label>Resource Type</label>
              <p>Meeting Room</p>
            </div>

            <div>
              <label>Location</label>
              <p>Block A</p>
            </div>

            <div>
              <label>Capacity</label>
              <p>12 people</p>
            </div>

            <div>
              <label>Status</label>
              <p className="available-text">Available</p>
            </div>
          </div>

          <div className="booking-placeholder">
            <h3>Book this resource</h3>
            <p>Select your booking date and available time slot.</p>

            <input type="date" />

            <select defaultValue="">
              <option value="" disabled>Select a time slot</option>
              <option>09:00 - 10:00</option>
              <option>10:00 - 11:00</option>
              <option>11:00 - 12:00</option>
              <option>14:00 - 15:00</option>
            </select>

            <button type="button">Request Booking</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ResourceDetails
