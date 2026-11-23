
import './Navbar.css'

function Navbar({ title }) {
  return (
    <header className="navbar">
      <div className="navbar-heading">
        <p>Workspace / {title}</p>
        <h2>{title}</h2>
      </div>

      <div className="navbar-actions">
        <button className="notification-button" title="Notifications">
          ♧
        </button>

        <div className="navbar-profile">
          <div className="profile-avatar">A</div>
          <span>Agent</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar
