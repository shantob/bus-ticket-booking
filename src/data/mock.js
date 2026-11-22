// Mock data: buses are generated for all 6 routes (6 buses each)
import { seatLabel } from '../utils/storage'
const day = o => new Date(Date.now() + o * 864e5).toISOString().slice(0, 10)
export const CITIES = ['Khulna', 'Dhaka', 'Rajshahi']
export const OPERATORS = ['Hanif Enterprise', 'Shyamoli Paribahan', 'Green Line', 'Ena Transport', 'Soudia', 'National Travels', 'Shohagh Paribahan', 'Desh Travels']
export const AMENITIES = ['WiFi', 'Water', 'Charging Port', 'Blanket', 'Snacks', 'CCTV']
export const TYPES = ['AC', 'Non-AC', 'Business', 'Sleeper']
const MUL = { AC: 1.2, 'Non-AC': 0.8, Business: 1.6, Sleeper: 2 }
const DEP = ['06:30', '09:00', '13:30', '20:00', '22:00', '23:30']
export const POINTS = { Khulna: ['Sonadanga Counter', 'Royal Mor', 'Fultola'], Dhaka: ['Gabtoli', 'Kallyanpur', 'Sayedabad'], Rajshahi: ['Binodpur', 'Shaheb Bazar', 'Nawdapara'] }
const pad = n => String(n).padStart(2, '0')
const addT = (t, h) => { const [a, b] = t.split(':').map(Number); const m = (a * 60 + b + Math.round(h * 60)) % 1440; return pad(Math.floor(m / 60)) + ':' + pad(m % 60) }
const R = [['Khulna', 'Dhaka', 6.5, 900], ['Dhaka', 'Khulna', 6.5, 900], ['Khulna', 'Rajshahi', 6, 800], ['Rajshahi', 'Khulna', 6, 800], ['Dhaka', 'Rajshahi', 6, 750], ['Rajshahi', 'Dhaka', 6, 750]]
export const ROUTES = R.map(([from, to, duration, basePrice], i) => ({ id: 'r' + (i + 1), from, to, duration, basePrice }))
let n = 0
export const BUSES = ROUTES.flatMap(r => DEP.map((dep, i) => {
  n++
  const type = TYPES[(i + n) % 4]
  return { id: 'b' + n, operator: OPERATORS[(n + i) % 8], type, from: r.from, to: r.to, departure: dep, arrival: addT(dep, r.duration), duration: r.duration,
    price: Math.round(r.basePrice * MUL[type] / 50) * 50, totalSeats: 40,
    booked: Array.from({ length: 6 + (n * 3) % 10 }, (_, j) => seatLabel(8 + (j * 7 + n * 5) % 32)),
    boarding: POINTS[r.from], dropping: POINTS[r.to], number: 'METRO-' + (1000 + n * 7), rating: +(3.8 + ((n * 3) % 12) / 10).toFixed(1),
    amenities: AMENITIES.filter((_, j) => j < 2 || (n + j) % 3 !== 0), status: 'Active' }
}))
export const ADMIN = { id: 'admin', name: 'Admin', email: 'admin@ticketcounter.com', password: 'admin123' }
export const USERS = [{ id: 'u1', name: 'Rahim Uddin', email: 'user@demo.com', password: '123456', phone: '01711000000', blocked: false, points: 250, saved: [{ name: 'Rahim Uddin', age: 30, gender: 'Male' }] }]
export const COUPONS = [{ id: 'c1', code: 'WELCOME10', type: 'percent', value: 10, minOrder: 500, active: true }, { id: 'c2', code: 'SAVE100', type: 'flat', value: 100, minOrder: 1500, active: true }]
const snap = b => ({ operator: b.operator, type: b.type, from: b.from, to: b.to, departure: b.departure, arrival: b.arrival, number: b.number })
export const BOOKINGS = [
  { id: 'TC240001', userId: 'u1', busId: 'b1', bus: snap(BUSES[0]), date: day(3), seats: ['C5', 'D5'], passengers: [{ name: 'Rahim Uddin', age: 30, gender: 'Male' }, { name: 'Karima Begum', age: 28, gender: 'Female' }], contact: { phone: '01711000000', email: 'user@demo.com' }, boarding: 'Sonadanga Counter', dropping: 'Gabtoli', fare: { base: BUSES[0].price * 2, service: 60, discount: 0, total: BUSES[0].price * 2 + 60 }, method: 'bKash', status: 'Confirmed', createdAt: day(-1) },
  { id: 'TC240002', userId: 'u1', busId: 'b13', bus: snap(BUSES[12]), date: day(-6), seats: ['A7'], passengers: [{ name: 'Rahim Uddin', age: 30, gender: 'Male' }], contact: { phone: '01711000000', email: 'user@demo.com' }, boarding: 'Sonadanga Counter', dropping: 'Binodpur', fare: { base: BUSES[12].price, service: 30, discount: 0, total: BUSES[12].price + 30 }, method: 'Nagad', status: 'Completed', createdAt: day(-9) },
]
