
import Layout from '../../components/Layout/Layout'
import TicketCard from '../../components/TicketCard/TicketCard'
import './Tickets.css'

const tickets = [
  {
    id: 'TK-101',
    title: 'Unable to access account',
    description: 'The user cannot log in to the application.',
    priority: 'High',
    category: 'Authentication',
    status: 'Open',
  },
  {
    id: 'TK-102',
    title: 'Email notifications not working',
    description: 'Notification emails are not reaching the user.',
    priority: 'Medium',
    category: 'Email',
    status: 'Pending',
  },
  {
    id: 'TK-103',
    title: 'Slow dashboard response',
    description: 'Dashboard response time is slower than expected.',
    priority: 'Low',
    category: 'Performance',
    status: 'Open',
  },
]

function Tickets() {
  return (
    <Layout title="Tickets">
      <div className="tickets-page">
        <div className="tickets-heading">
          <div>
            <h1>Ticket Triage Queue</h1>
            <p>Review and manage incoming support tickets.</p>
          </div>

          <button className="refresh-button" onClick={() => window.location.reload()}>
            ↻ Refresh
          </button>
        </div>

        <div className="tickets-toolbar">
          <input type="text" placeholder="Search tickets..." />
          <select defaultValue="all">
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select defaultValue="all">
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="tickets-list">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Tickets
