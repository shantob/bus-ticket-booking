import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button, Select, Input } from './ui'
import { CITIES } from '../data/mock'
import { today } from '../utils/storage'
/** Bus search form with validation; navigates to /search?from&to&date&pax&type */
export default function SearchForm({ initial = {} }) {
  const nav = useNavigate()
  const [f, setF] = useState({ from: 'Khulna', to: 'Dhaka', date: today(), pax: 1, type: 'All', ...initial })
  const [err, setErr] = useState('')
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = e => {
    e.preventDefault()
    if (f.from === f.to) return setErr('From and To cities must be different')
    if (f.date < today()) return setErr('Journey date cannot be in the past')
    setErr(''); nav('/search?' + new URLSearchParams(f))
  }
  return <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end text-slate-800">
    <Select label="From" value={f.from} onChange={set('from')} options={CITIES} />
    <Select label="To" value={f.to} onChange={set('to')} options={CITIES} />
    <Input label="Journey Date" type="date" min={today()} value={f.date} onChange={set('date')} />
    <Select label="Passengers" value={f.pax} onChange={set('pax')} options={[1, 2, 3, 4, 5, 6].map(n => ({ value: n, label: n + (n > 1 ? ' Passengers' : ' Passenger') }))} />
    <Select label="Bus Type" value={f.type} onChange={set('type')} options={['All', 'AC', 'Non-AC', 'Business', 'Sleeper']} />
    <Button variant="accent" type="submit"><Search size={18} />Search Buses</Button>
    {err && <p className="text-red-600 text-sm sm:col-span-2 lg:col-span-6">{err}</p>}
  </form>
}
