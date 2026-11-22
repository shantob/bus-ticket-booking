import { Calendar, MapPin, Ticket } from 'lucide-react'
import { Badge, Button } from './ui'
import { taka, today } from '../utils/storage'
/** Effective status: confirmed trips in the past show as Completed */
export const effStatus = b => (b.status === 'Confirmed' && b.date < today() ? 'Completed' : b.status)
export default function BookingCard({ b, onView, onCancel }) {
  const st = effStatus(b)
  return <div className="bg-white border rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-start gap-2"><div><p className="text-xs text-slate-500">Booking ID</p><p className="font-bold">{b.id}</p></div><Badge>{st}</Badge></div>
    <h4 className="font-semibold mt-3 flex items-center gap-1"><MapPin size={16} />{b.bus.from} → {b.bus.to}</h4>
    <p className="text-sm text-slate-600 mt-1 flex items-center gap-1"><Calendar size={14} />{b.date}, {b.bus.departure} · {b.bus.operator}</p>
    <p className="text-sm text-slate-600 flex items-center gap-1"><Ticket size={14} />Seats: {b.seats.join(', ')} · <b>{taka(b.fare.total)}</b></p>
    <div className="flex gap-2 mt-4"><Button variant="outline" className="flex-1" onClick={() => onView(b)}>View Ticket</Button>
      {(st === 'Confirmed' || st === 'Pending') && <Button variant="danger" onClick={() => onCancel(b)}>Cancel</Button>}</div></div>
}
