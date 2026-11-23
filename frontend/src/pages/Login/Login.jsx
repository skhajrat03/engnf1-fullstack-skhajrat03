
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>TriageSync</span>
        </div>

        <h1>Welcome back</h1>
        <p className="auth-description">
          Sign in to access your support workspace.
        </p>

        <form className="auth-form">
          <label>Email address</label>
          <input type="email" placeholder="name@example.com" required />

          <label>Password</label>
          <input type="password" placeholder="Enter password" required />

          <button type="submit">Sign In</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
