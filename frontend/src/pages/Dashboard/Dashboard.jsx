
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/StatCard/StatCard';
import TicketCard from '../../components/TicketCard/TicketCard';
import './Dashboard.css';

const sampleTickets = [
  {
    id: 'TK-101',
    title: 'Unable to access account',
    description: 'User cannot log in to the portal.',
    priority: 'High',
    category: 'Authentication',
    status: 'Open',
  },
  {
    id: 'TK-102',
    title: 'Email notifications not working',
    description: 'Notification emails are not being received.',
    priority: 'Medium',
    category: 'Email',
    status: 'Pending',
  },
  {
    id: 'TK-103',
    title: 'Page loading slowly',
    description: 'Dashboard takes too long to load.',
    priority: 'Low',
    category: 'Performance',
    status: 'Open',
  },
];

function Dashboard() {
  const totalTickets = sampleTickets.length;

  const openTickets = sampleTickets.filter(
    (ticket) => ticket.status === 'Open'
  ).length;

  const urgentTickets = sampleTickets.filter(
    (ticket) => ticket.priority === 'High'
  ).length;

  const resolvedTickets = sampleTickets.filter(
    (ticket) => ticket.status === 'Resolved'
  ).length;

  return (
    <Layout title="Dashboard">
      <div className="dashboard">
        <div className="dashboard-welcome">
          <h1>Overview</h1>
          <p>Monitor your ticket queue and support activity.</p>
        </div>

        <div className="dashboard-stats">
          <StatCard
            title="Total Tickets"
            value={totalTickets}
            subtitle="All tickets"
            icon="▤"
          />

          <StatCard
            title="Open Tickets"
            value={openTickets}
            subtitle="Awaiting action"
            icon="◷"
          />

          <StatCard
            title="Urgent Tickets"
            value={urgentTickets}
            subtitle="High priority"
            icon="⚡"
          />

          <StatCard
            title="Resolved"
            value={resolvedTickets}
            subtitle="Completed tickets"
            icon="✓"
          />
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <h2>Recent Tickets</h2>
          </div>

          <div className="recent-ticket-list">
            {sampleTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
