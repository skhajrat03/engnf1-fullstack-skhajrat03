
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '▦' },
  { name: 'Tickets', path: '/tickets', icon: '▤' },
  { name: 'Resources', path: '/resources', icon: '▣' },
  { name: 'Bookings', path: '/bookings', icon: '◷' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">T</span>
        <span>TriageSync</span>
      </div>

      <p className="sidebar-label">WORKSPACE</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">A</div>
        <div className="sidebar-user">
          <h4>Support Agent</h4>
          <p>Agent Account</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
