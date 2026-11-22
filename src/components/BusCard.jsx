import { Link } from 'react-router-dom'
import { Star, Wifi, Droplets, Plug, BedDouble, Cookie, Cctv, ArrowRight } from 'lucide-react'
import { Badge, Button } from './ui'
import { taka } from '../utils/storage'
const ICON = { WiFi: Wifi, Water: Droplets, 'Charging Port': Plug, Blanket: BedDouble, Snacks: Cookie, CCTV: Cctv }
/** One bus in search results */
export default function BusCard({ bus, date, pax, available }) {
  const q = `?date=${date}&pax=${pax}`
  return <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition">
    <div className="flex flex-wrap justify-between gap-3">
      <div><h3 className="font-bold text-lg">{bus.operator}</h3><div className="flex gap-2 items-center mt-1"><Badge color="bg-blue-100 text-primary">{bus.type}</Badge><span className="text-xs text-slate-500">{bus.number}</span></div></div>
      <span className="flex items-center gap-1 h-fit bg-green-100 text-secondary px-2 py-1 rounded-lg text-sm font-semibold"><Star size={14} fill="currentColor" />{bus.rating}</span>
    </div>
    <div className="grid grid-cols-3 gap-2 items-center my-4 text-center">
      <div><p className="text-xl font-bold">{bus.departure}</p><p className="text-xs text-slate-500">{bus.boarding[0]}</p></div>
      <div className="text-xs text-slate-500"><div className="flex items-center gap-1 justify-center"><span className="h-px bg-slate-300 flex-1" /><ArrowRight size={14} /></div>{bus.duration} hrs</div>
      <div><p className="text-xl font-bold">{bus.arrival}</p><p className="text-xs text-slate-500">{bus.dropping[0]}</p></div>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">{bus.amenities.map(a => { const I = ICON[a]; return <span key={a} className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-lg"><I size={12} />{a}</span> })}</div>
    <div className="flex flex-wrap items-end justify-between gap-3 border-t pt-4">
      <div><p className="text-2xl font-bold text-primary">{taka(bus.price)}<span className="text-xs text-slate-500 font-normal"> /seat</span></p>
        <p className={available < 6 ? 'text-sm text-red-600' : 'text-sm text-secondary'}>{available} of {bus.totalSeats} seats available</p></div>
      <div className="flex gap-2"><Link to={`/bus/${bus.id}${q}`}><Button variant="outline">View Seats</Button></Link><Link to={`/bus/${bus.id}${q}`}><Button variant="accent" disabled={!available}>Book Now</Button></Link></div>
    </div></div>
}
