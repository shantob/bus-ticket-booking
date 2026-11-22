import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Download, Printer } from 'lucide-react'
import TicketView from '../components/TicketView'
import { Button, EmptyState } from '../components/ui'
import { useApp } from '../context/AppContext'
export default function Confirmation() {
  const { id } = useParams(); const { bookings } = useApp(); const b = bookings.find(x => x.id === id)
  if (!b) return <EmptyState title="Booking not found" text="Check My Bookings for your tickets." action={<Link to="/my-bookings"><Button>My bookings</Button></Link>} />
  const download = () => { // frontend-only download: plain-text ticket
    const t = `TICKET COUNTER\nBooking ID: ${b.id}\n${b.bus.from} -> ${b.bus.to}\nDate: ${b.date} ${b.bus.departure}\nBus: ${b.bus.operator} (${b.bus.number})\nSeats: ${b.seats.join(', ')}\nPassengers: ${b.passengers.map(p => p.name).join(', ')}\nTotal: BDT ${b.fare.total}\nStatus: ${b.status}`
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain' })); a.download = `ticket-${b.id}.txt`; a.click()
  }
  return <div className="max-w-3xl mx-auto px-4 py-8"><div className="text-center mb-6"><CheckCircle2 className="mx-auto text-secondary" size={64} /><h1 className="text-3xl font-bold mt-2">{b.status === 'Pending' ? 'Booking reserved' : 'Booking confirmed!'}</h1><p className="text-slate-600">Your booking ID is <b>{b.id}</b></p></div>
    <TicketView b={b} />
    <div className="flex flex-wrap gap-3 justify-center mt-6 no-print"><Button variant="outline" onClick={download}><Download size={18} />Download ticket</Button><Button variant="outline" onClick={() => window.print()}><Printer size={18} />Print ticket</Button>
      <Link to="/my-bookings"><Button>View my bookings</Button></Link><Link to="/"><Button variant="secondary">Go to home</Button></Link></div></div>
}
