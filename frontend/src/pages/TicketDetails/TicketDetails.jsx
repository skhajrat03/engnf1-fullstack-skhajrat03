
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import './TicketDetails.css'

function TicketDetails() {
  const { id } = useParams()

  return (
    <Layout title="Ticket Details">
      <div className="ticket-details-page">
        <Link to="/tickets" className="back-link">
          ← Back to Tickets
        </Link>

        <div className="ticket-details-panel">
          <div className="ticket-details-header">
            <div>
              <p className="ticket-details-id">Ticket #{id}</p>
              <h1>Unable to access account</h1>
            </div>

            <span className="details-priority">High Priority</span>
          </div>

          <div className="details-grid">
            <div>
              <label>Status</label>
              <p>Open</p>
            </div>

            <div>
              <label>Category</label>
              <p>Authentication</p>
            </div>

            <div>
              <label>Created</label>
              <p>—</p>
            </div>

            <div>
              <label>Assigned to</label>
              <p>Unassigned</p>
            </div>
          </div>

          <div className="details-description">
            <h3>Description</h3>
            <p>
              The user reports being unable to access their account.
              Further investigation is required.
            </p>
          </div>

          <div className="details-actions">
            <button className="secondary-button">Edit Ticket</button>
            <button className="primary-action">Mark as Resolved</button>
          </div>
        </div>

        <div className="ticket-history-panel">
          <h2>Audit History</h2>
          <p>Ticket events and review changes will appear here.</p>
        </div>
      </div>
    </Layout>
  )
}

export default TicketDetails
