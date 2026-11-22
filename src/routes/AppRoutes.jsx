import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import SeatSelection from '../pages/SeatSelection'
import Passenger from '../pages/Passenger'
import Payment from '../pages/Payment'
import Confirmation from '../pages/Confirmation'
import MyBookings from '../pages/MyBookings'
import Profile from '../pages/Profile'
import { Login, Register, Forgot, AdminLogin } from '../pages/Auth'
import { Help, About, Contact, NotFound } from '../pages/Static'
import { Dashboard, ManageBuses, ManageRoutes, ManageBookings, ManageUsers, ManageCoupons, Reports } from '../pages/Admin'
export default function AppRoutes() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} /><Route path="/search" element={<SearchResults />} /><Route path="/bus/:id" element={<SeatSelection />} />
      <Route path="/passenger" element={<Passenger />} /><Route path="/payment" element={<Payment />} /><Route path="/confirmation/:id" element={<Confirmation />} />
      <Route path="/my-bookings" element={<MyBookings />} /><Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/forgot-password" element={<Forgot />} />
      <Route path="/help" element={<Help />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} /></Route>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} /><Route path="buses" element={<ManageBuses />} /><Route path="routes" element={<ManageRoutes />} />
      <Route path="bookings" element={<ManageBookings />} /><Route path="users" element={<ManageUsers />} /><Route path="coupons" element={<ManageCoupons />} /><Route path="reports" element={<Reports />} /></Route>
  </Routes>
}
