import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bus, Menu, X, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button } from './ui'
const links = [['/', 'Home'], ['/search', 'Book Tickets'], ['/my-bookings', 'My Bookings'], ['/help', 'Help'], ['/about', 'About'], ['/contact', 'Contact']]
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout, toast } = useApp(); const nav = useNavigate()
  const cls = ({ isActive }) => 'px-3 py-2 rounded-lg font-medium ' + (isActive ? 'text-primary bg-blue-50' : 'text-slate-600 hover:text-primary')
  return <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary"><span className="bg-primary text-white p-1.5 rounded-lg"><Bus size={20} /></span>Ticket Counter</Link>
      <div className="hidden lg:flex items-center gap-1">{links.map(([to, l]) => <NavLink key={to} to={to} className={cls}>{l}</NavLink>)}</div>
      <div className="hidden lg:flex items-center gap-2">{user ? <>
        <Link to="/profile" className="flex items-center gap-1 font-medium"><User size={18} />{user.name.split(' ')[0]}</Link>
        <Button variant="outline" onClick={() => { logout(); toast('Logged out'); nav('/') }}>Logout</Button></> : <>
        <Link to="/login"><Button variant="outline">Login</Button></Link><Link to="/register"><Button>Register</Button></Link></>}</div>
      <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="lg:hidden border-t p-4 flex flex-col gap-1 bg-white" onClick={() => setOpen(false)}>
      {links.map(([to, l]) => <NavLink key={to} to={to} className={cls}>{l}</NavLink>)}
      {user ? <><NavLink to="/profile" className={cls}>Profile</NavLink><button className="text-left px-3 py-2 text-red-600" onClick={() => { logout(); nav('/') }}>Logout</button></>
        : <><NavLink to="/login" className={cls}>Login</NavLink><NavLink to="/register" className={cls}>Register</NavLink></>}</div>}
  </nav>
}
