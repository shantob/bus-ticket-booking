import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import SearchForm from '../components/SearchForm'
import BusCard from '../components/BusCard'
import { EmptyState, LoadingSkeleton, Select, Button } from '../components/ui'
import { useApp } from '../context/AppContext'
import { AMENITIES, OPERATORS, TYPES } from '../data/mock'
const slot = t => { const h = +t.slice(0, 2); return h < 6 ? 'Night' : h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening' }
const SORT = { 'Price: low to high': (a, b) => a.price - b.price, 'Price: high to low': (a, b) => b.price - a.price, 'Departure time': (a, b) => a.departure.localeCompare(b.departure), Duration: (a, b) => a.duration - b.duration, 'Rating': (a, b) => b.rating - a.rating }
export default function SearchResults() {
  const [sp] = useSearchParams(); const { buses, takenSeats } = useApp()
  const q = { from: sp.get('from') || 'Khulna', to: sp.get('to') || 'Dhaka', date: sp.get('date') || '', pax: +sp.get('pax') || 1, type: sp.get('type') || 'All' }
  const [loading, setLoading] = useState(true); const [show, setShow] = useState(false)
  const [f, setF] = useState({ type: q.type, time: 'All', op: 'All', maxPrice: 4000, rating: 0, am: [], sort: 'Departure time' })
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t) }, [sp])
  useEffect(() => setF(x => ({ ...x, type: q.type })), [q.type])
  const list = useMemo(() => buses.filter(b => b.status === 'Active' && b.from === q.from && b.to === q.to
    && (f.type === 'All' || b.type === f.type) && (f.time === 'All' || slot(b.departure) === f.time) && (f.op === 'All' || b.operator === f.op)
    && b.price <= f.maxPrice && b.rating >= f.rating && f.am.every(a => b.amenities.includes(a))).sort(SORT[f.sort]), [buses, q.from, q.to, f])
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const reset = () => setF({ type: 'All', time: 'All', op: 'All', maxPrice: 4000, rating: 0, am: [], sort: 'Departure time' })
  return <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="bg-blue-50 rounded-2xl p-4 mb-6"><p className="font-bold text-lg">{q.from} → {q.to}</p><p className="text-sm text-slate-600">{q.date} · {q.pax} passenger(s)</p></div>
    <SearchForm initial={q} />
    <div className="grid lg:grid-cols-4 gap-6 mt-6">
      <div className="lg:col-span-1"><Button variant="outline" className="lg:hidden w-full mb-3" onClick={() => setShow(!show)}><SlidersHorizontal size={16} />Filters</Button>
        <div className={(show ? 'block' : 'hidden') + ' lg:block bg-white border rounded-2xl p-4 space-y-3 h-fit'}>
          <Select label="Bus type" value={f.type} onChange={set('type')} options={['All', ...TYPES]} />
          <Select label="Departure time" value={f.time} onChange={set('time')} options={['All', 'Morning', 'Afternoon', 'Evening', 'Night']} />
          <Select label="Operator" value={f.op} onChange={set('op')} options={['All', ...OPERATORS]} />
          <label className="block text-sm font-medium">Max price: ৳{f.maxPrice}<input type="range" min="500" max="4000" step="100" value={f.maxPrice} onChange={set('maxPrice')} className="w-full" /></label>
          <Select label="Minimum rating" value={f.rating} onChange={e => setF({ ...f, rating: +e.target.value })} options={[{ value: 0, label: 'Any' }, { value: 4, label: '4.0+' }, { value: 4.5, label: '4.5+' }]} />
          <div><p className="text-sm font-medium mb-1">Amenities</p>{AMENITIES.map(a => <label key={a} className="flex gap-2 text-sm"><input type="checkbox" checked={f.am.includes(a)} onChange={e => setF({ ...f, am: e.target.checked ? [...f.am, a] : f.am.filter(x => x !== a) })} />{a}</label>)}</div>
          <Button variant="outline" className="w-full" onClick={reset}>Reset filters</Button></div></div>
      <div className="lg:col-span-3"><div className="flex justify-between items-center mb-4"><p className="font-semibold">{loading ? 'Searching...' : `${list.length} buses found`}</p>
        <div className="w-52"><Select label="" value={f.sort} onChange={set('sort')} options={Object.keys(SORT)} /></div></div>
        {loading ? <LoadingSkeleton /> : list.length ? <div className="space-y-4">{list.map(b => <BusCard key={b.id} bus={b} date={q.date} pax={q.pax} available={b.totalSeats - takenSeats(b.id, q.date).size} />)}</div>
          : <EmptyState title="No buses found" text="Try changing the date, route or filters." action={<Button onClick={reset}>Clear filters</Button>} />}</div></div></div>
}
