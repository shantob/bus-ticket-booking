import { createContext, useContext, useState, useCallback } from 'react'
import { BUSES, ROUTES, USERS, COUPONS, BOOKINGS, ADMIN } from '../data/mock'
import { usePersist } from '../utils/storage'
const Ctx = createContext()
export const useApp = () => useContext(Ctx)

/** Global state: mock "database" (persisted in localStorage), session, booking draft, toasts */
export function AppProvider({ children }) {
  const [buses, setBuses] = usePersist('tc_buses', BUSES)
  const [routes, setRoutes] = usePersist('tc_routes', ROUTES)
  const [users, setUsers] = usePersist('tc_users', USERS)
  const [bookings, setBookings] = usePersist('tc_bookings', BOOKINGS)
  const [coupons, setCoupons] = usePersist('tc_coupons', COUPONS)
  const [session, setSession] = usePersist('tc_session', null)
  const [draft, setDraft] = useState(null) // booking in progress
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success') => {
    const id = Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])
  const user = session?.role === 'user' ? users.find(u => u.id === session.id) || null : null
  const isAdmin = session?.role === 'admin'

  /** Seats unavailable for a bus on a date = pre-booked + seats in active bookings */
  const takenSeats = (busId, date) => {
    const s = new Set(buses.find(b => b.id === busId)?.booked || [])
    bookings.filter(b => b.busId === busId && b.date === date && b.status !== 'Cancelled').forEach(b => b.seats.forEach(x => s.add(x)))
    return s
  }
  const login = (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) { setSession({ role: 'admin', name: ADMIN.name }); return 'admin' }
    const u = users.find(x => x.email === email && x.password === password)
    if (!u) return null
    if (u.blocked) return 'blocked'
    setSession({ role: 'user', id: u.id }); return 'user'
  }
  const register = d => {
    if (users.some(u => u.email === d.email)) return false
    const u = { id: 'u' + Date.now(), points: 0, saved: [], blocked: false, ...d }
    setUsers(x => [...x, u]); setSession({ role: 'user', id: u.id }); return true
  }
  const logout = () => setSession(null)
  const updateUser = (id, p) => setUsers(x => x.map(u => (u.id === id ? { ...u, ...p } : u)))
  const addBooking = b => setBookings(x => [b, ...x])
  const updateBooking = (id, p) => setBookings(x => x.map(b => (b.id === id ? { ...b, ...p } : b)))

  return <Ctx.Provider value={{ buses, setBuses, routes, setRoutes, users, setUsers, bookings, coupons, setCoupons, user, isAdmin, draft, setDraft, toasts, toast,
    takenSeats, login, register, logout, updateUser, addBooking, updateBooking }}>{children}</Ctx.Provider>
}
