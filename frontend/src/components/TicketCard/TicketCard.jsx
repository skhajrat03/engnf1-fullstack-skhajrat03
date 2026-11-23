
import './TicketCard.css'

function TicketCard({ ticket }) {
  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <span className="ticket-id">#{ticket.id}</span>

        <span className={`ticket-priority ${ticket.priority.toLowerCase()}`}>
          {ticket.priority}
        </span>
      </div>

      <h3>{ticket.title}</h3>
      <p className="ticket-description">{ticket.description}</p>

      <div className="ticket-card-footer">
        <span className="ticket-category">{ticket.category}</span>

        <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
          {ticket.status}
        </span>
      </div>
    </div>
  )
}

export default TicketCard
