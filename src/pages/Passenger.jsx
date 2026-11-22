import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import FareSummary, { calcFare } from '../components/FareSummary'
import { Button, Input, Select } from '../components/ui'
import { LADIES } from '../components/SeatMap'
import { useApp } from '../context/AppContext'
export default function Passenger() {
  const { draft, setDraft, buses, coupons, user, toast } = useApp(); const nav = useNavigate()
  const bus = buses.find(b => b.id === draft?.busId)
  const [ps, setPs] = useState(() => draft?.seats.map((_, i) => ({ name: i === 0 && user ? user.name : '', age: '', gender: 'Male' })) || [])
  const [c, setC] = useState({ phone: user?.phone || '', email: user?.email || '' })
  const [pt, setPt] = useState({ boarding: bus?.boarding[0], dropping: bus?.dropping[0] })
  const [code, setCode] = useState(''); const [disc, setDisc] = useState({ code: '', amount: 0 })
  const [agree, setAgree] = useState(false); const [err, setErr] = useState({})
  if (!draft || !bus) return <Navigate to="/search" replace />
  if (!user) return <Navigate to="/login" state={{ from: '/passenger' }} replace />
  const fare = calcFare(bus.price, draft.seats.length, disc.amount)
  const upd = (i, k, v) => setPs(ps.map((p, j) => j === i ? { ...p, [k]: v } : p))
  const apply = () => {
    const cp = coupons.find(x => x.code === code.trim().toUpperCase() && x.active)
    if (!cp) return toast('Invalid or inactive coupon', 'error')
    if (fare.base < cp.minOrder) return toast(`Minimum order ৳${cp.minOrder} required`, 'error')
    setDisc({ code: cp.code, amount: cp.type === 'percent' ? Math.round(fare.base * cp.value / 100) : cp.value }); toast('Coupon applied')
  }
  const submit = e => {
    e.preventDefault(); const er = {}
    ps.forEach((p, i) => {
      if (p.name.trim().length < 3) er['n' + i] = 'Enter full name'
      if (!(+p.age >= 1 && +p.age <= 100)) er['a' + i] = 'Age 1-100'
      if (LADIES.includes(draft.seats[i]) && p.gender !== 'Female') er['g' + i] = 'Ladies seat needs Female passenger'
    })
    if (!/^01[3-9]\d{8}$/.test(c.phone)) er.phone = 'Enter a valid BD number (01XXXXXXXXX)'
    if (!/^\S+@\S+\.\S+$/.test(c.email)) er.email = 'Enter a valid email'
    if (!agree) er.agree = 'Please accept the terms'
    setErr(er); if (Object.keys(er).length) return toast('Please fix the highlighted fields', 'error')
    setDraft({ ...draft, passengers: ps, contact: c, ...pt, fare, coupon: disc.code }); nav('/payment')
  }
  return <form onSubmit={submit} className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-5">
      {ps.map((p, i) => <div key={i} className="bg-white border rounded-2xl p-5"><h3 className="font-bold mb-3">Passenger {i + 1} · Seat {draft.seats[i]}</h3>
        <div className="grid sm:grid-cols-3 gap-3"><Input label="Full name" value={p.name} error={err['n' + i]} onChange={e => upd(i, 'name', e.target.value)} />
          <Input label="Age" type="number" value={p.age} error={err['a' + i]} onChange={e => upd(i, 'age', e.target.value)} />
          <Select label="Gender" value={p.gender} error={err['g' + i]} onChange={e => upd(i, 'gender', e.target.value)} options={['Male', 'Female', 'Other']} /></div></div>)}
      <div className="bg-white border rounded-2xl p-5"><h3 className="font-bold mb-3">Contact & trip points</h3><div className="grid sm:grid-cols-2 gap-3">
        <Input label="Phone" value={c.phone} error={err.phone} onChange={e => setC({ ...c, phone: e.target.value })} />
        <Input label="Email" type="email" value={c.email} error={err.email} onChange={e => setC({ ...c, email: e.target.value })} />
        <Select label="Boarding point" value={pt.boarding} onChange={e => setPt({ ...pt, boarding: e.target.value })} options={bus.boarding} />
        <Select label="Dropping point" value={pt.dropping} onChange={e => setPt({ ...pt, dropping: e.target.value })} options={bus.dropping} /></div></div>
      <div className="bg-white border rounded-2xl p-5"><h3 className="font-bold mb-3">Promo code</h3><div className="flex gap-2 items-end"><div className="flex-1"><Input label="" placeholder="Try WELCOME10 or SAVE100" value={code} onChange={e => setCode(e.target.value)} /></div><Button type="button" variant="secondary" onClick={apply}>Apply</Button></div></div>
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />I agree to the Terms & Conditions and Refund Policy.</label>{err.agree && <p className="text-xs text-red-600">{err.agree}</p>}</div>
    <div><FareSummary bus={bus} date={draft.date} seats={draft.seats} fare={fare} /><Button type="submit" variant="accent" className="w-full mt-4">Continue to payment</Button></div></form>
}
