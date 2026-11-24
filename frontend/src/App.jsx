
import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Tickets from './pages/Tickets/Tickets'
import TicketDetails from './pages/TicketDetails/TicketDetails'
import Resources from './pages/Resources/Resources'
import ResourceDetails from './pages/ResourceDetails/ResourceDetails'
import Bookings from './pages/Bookings/Bookings'
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/tickets/:id" element={<TicketDetails />} />

      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:id" element={<ResourceDetails />} />

      <Route path="/bookings" element={<Bookings />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
