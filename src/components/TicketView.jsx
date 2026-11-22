import { QrCode } from 'lucide-react'
import { taka } from '../utils/storage'
import { effStatus } from './BookingCard'
/** Printable ticket (used on confirmation page and in modals) */
export default function TicketView({ b }) {
  return <div className="border-2 border-dashed border-primary rounded-2xl p-5 bg-white">
    <div className="flex justify-between items-start"><div><h3 className="text-xl font-bold text-primary">Ticket Counter</h3><p className="text-sm text-slate-500">Booking ID: <b>{b.id}</b></p></div><QrCode size={64} className="text-slate-700" /></div>
    <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
      <p><b>Route:</b> {b.bus.from} → {b.bus.to}</p><p><b>Date:</b> {b.date}</p>
      <p><b>Bus:</b> {b.bus.operator} ({b.bus.type})</p><p><b>Bus No:</b> {b.bus.number}</p>
      <p><b>Departure:</b> {b.bus.departure}</p><p><b>Arrival:</b> {b.bus.arrival}</p>
      <p><b>Boarding:</b> {b.boarding}</p><p><b>Dropping:</b> {b.dropping}</p>
      <p><b>Seats:</b> {b.seats.join(', ')}</p><p><b>Status:</b> {effStatus(b)}</p>
      <p><b>Payment:</b> {b.method}</p><p><b>Total:</b> {taka(b.fare.total)}</p></div>
    <div className="mt-4 border-t pt-3 text-sm"><b>Passengers:</b><ul className="mt-1">{b.passengers.map((p, i) => <li key={i}>{p.name} ({p.gender}, {p.age}) – Seat {b.seats[i]}</li>)}</ul>
      <p className="mt-1 text-slate-500">Contact: {b.contact.phone} · {b.contact.email}</p></div></div>
}
