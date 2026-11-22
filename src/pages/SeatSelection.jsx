import { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import SeatMap from '../components/SeatMap'
import FareSummary, { calcFare } from '../components/FareSummary'
import { Badge, Button, EmptyState } from '../components/ui'
import { useApp } from '../context/AppContext'
export default function SeatSelection() {
  const { id } = useParams(); const [sp] = useSearchParams(); const nav = useNavigate()
  const { buses, takenSeats, setDraft, toast } = useApp()
  const bus = buses.find(b => b.id === id); const date = sp.get('date'); const pax = +sp.get('pax') || 1
  const [sel, setSel] = useState([])
  if (!bus) return <EmptyState title="Bus not found" text="This bus is no longer available." action={<Link to="/search"><Button>Search again</Button></Link>} />
  const toggle = s => setSel(x => x.includes(s) ? x.filter(i => i !== s) : x.length >= pax ? (toast(`You can select only ${pax} seat(s)`, 'error'), x) : [...x, s])
  const next = () => { if (sel.length !== pax) return toast(`Please select exactly ${pax} seat(s)`, 'error'); setDraft({ busId: bus.id, date, seats: sel }); nav('/passenger') }
  return <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white border rounded-2xl p-5"><div className="flex justify-between flex-wrap gap-2"><h1 className="text-2xl font-bold">{bus.operator}</h1><Badge color="bg-blue-100 text-primary">{bus.type}</Badge></div>
        <p className="text-slate-600 mt-1">{bus.number} · ⭐ {bus.rating} · {bus.amenities.join(', ')}</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm"><p><b>Route:</b> {bus.from} → {bus.to}</p><p><b>Date:</b> {date}</p><p><b>Departure:</b> {bus.departure} from {bus.boarding.join(' / ')}</p><p><b>Arrival:</b> {bus.arrival} at {bus.dropping.join(' / ')}</p></div></div>
      <div className="bg-white border rounded-2xl p-5"><h2 className="font-bold text-lg mb-3">Select {pax} seat(s)</h2><SeatMap taken={takenSeats(bus.id, date)} selected={sel} onToggle={toggle} />
        <p className="text-xs text-slate-500 mt-3">Pink seats are reserved for female passengers.</p></div></div>
    <div><FareSummary bus={bus} date={date} seats={sel} fare={calcFare(bus.price, sel.length)} /><Button className="w-full mt-4" variant="accent" onClick={next}>Continue to passenger details</Button></div></div>
}
