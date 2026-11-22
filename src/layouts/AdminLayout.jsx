import { useState } from 'react'
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Bus, Route, Ticket, Users, Percent, BarChart3, LogOut, Menu } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ToastContainer } from '../components/ui'
const L = [['/admin', 'Dashboard', LayoutDashboard], ['/admin/buses', 'Buses', Bus], ['/admin/routes', 'Routes', Route], ['/admin/bookings', 'Bookings', Ticket], ['/admin/users', 'Users', Users], ['/admin/coupons', 'Coupons', Percent], ['/admin/reports', 'Reports', BarChart3]]
export default function AdminLayout() {
  const { isAdmin, logout } = useApp(); const nav = useNavigate(); const [open, setOpen] = useState(false)
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <div className="min-h-screen bg-slate-50 lg:flex"><ToastContainer />
    <aside className={(open ? 'block' : 'hidden') + ' lg:block lg:w-60 bg-slate-900 text-slate-300 p-4 lg:min-h-screen'}>
      <h2 className="text-white font-bold text-lg mb-4">Ticket Counter Admin</h2>
      <nav className="space-y-1" onClick={() => setOpen(false)}>{L.map(([to, l, I]) => <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) => 'flex items-center gap-2 px-3 py-2 rounded-lg ' + (isActive ? 'bg-primary text-white' : 'hover:bg-slate-800')}><I size={18} />{l}</NavLink>)}
        <button className="flex items-center gap-2 px-3 py-2 text-red-400" onClick={() => { logout(); nav('/admin/login') }}><LogOut size={18} />Logout</button></nav></aside>
    <div className="flex-1 min-w-0"><header className="lg:hidden bg-white border-b p-3"><button onClick={() => setOpen(!open)}><Menu /></button></header><div className="p-4 md:p-6 page"><Outlet /></div></div></div>
}
