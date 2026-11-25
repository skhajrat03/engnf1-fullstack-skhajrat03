
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
import MyBookings from './pages/MyBookings/MyBookings';
import AdminBookings from './pages/AdminBookings/AdminBookings';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminLayout from './components/AdminLayout/AdminLayout';

import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminBookings from './pages/AdminBookings/AdminBookings';

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
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
