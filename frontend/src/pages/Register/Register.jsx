
import { Link } from 'react-router-dom'
import './Register.css'
import '../Login/Login.css'
function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>TriageSync</span>
        </div>

        <h1>Create account</h1>
        <p className="auth-description">
          Create an account to access your workspace.
        </p>

        <form className="auth-form">
          <label>Full name</label>
          <input type="text" placeholder="Your full name" required />

          <label>Email address</label>
          <input type="email" placeholder="name@example.com" required />

          <label>Password</label>
          <input type="password" placeholder="Create password" required />

          <button type="submit">Create Account</button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
