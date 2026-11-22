import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import FareSummary from '../components/FareSummary'
import { Button, Input, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
const M = ['bKash', 'Nagad', 'Rocket', 'Card', 'Cash on Counter']
export default function Payment() {
  const { draft, setDraft, buses, user, addBooking, updateUser, toast } = useApp(); const nav = useNavigate()
  const [m, setM] = useState('bKash'); const [num, setNum] = useState(''); const [card, setCard] = useState({ no: '', exp: '', cvv: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const bus = buses.find(b => b.id === draft?.busId)
  if (!draft?.passengers || !bus || !user) return <Navigate to="/search" replace />
  const pay = () => {
    if (['bKash', 'Nagad', 'Rocket'].includes(m) && !/^01[3-9]\d{8}$/.test(num)) return setErr('Enter a valid mobile wallet number')
    if (m === 'Card' && (!/^\d{16}$/.test(card.no.replace(/\s/g, '')) || !/^\d{2}\/\d{2}$/.test(card.exp) || !/^\d{3}$/.test(card.cvv))) return setErr('Check card number (16 digits), expiry (MM/YY) and CVV (3 digits)')
    setErr(''); setBusy(true)
    setTimeout(() => { // simulated payment: no real gateway
      const id = 'TC' + Date.now().toString().slice(-8)
      addBooking({ id, userId: user.id, busId: bus.id, bus: { operator: bus.operator, type: bus.type, from: bus.from, to: bus.to, departure: bus.departure, arrival: bus.arrival, number: bus.number },
        date: draft.date, seats: draft.seats, passengers: draft.passengers, contact: draft.contact, boarding: draft.boarding, dropping: draft.dropping, fare: draft.fare, method: m,
        status: m === 'Cash on Counter' ? 'Pending' : 'Confirmed', createdAt: new Date().toISOString().slice(0, 10) })
      updateUser(user.id, { points: user.points + Math.floor(draft.fare.total / 20) }); setDraft(null); toast('Booking successful!'); nav('/confirmation/' + id)
    }, 1500)
  }
  return <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 bg-white border rounded-2xl p-5"><h2 className="font-bold text-xl mb-4">Choose payment method</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">{M.map(x => <button key={x} onClick={() => { setM(x); setErr('') }} className={cx('p-3 rounded-xl border-2 font-semibold text-sm', m === x ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200')}>{x}</button>)}</div>
      <div className="mt-5 space-y-3 max-w-md">
        {['bKash', 'Nagad', 'Rocket'].includes(m) && <Input label={m + ' number'} placeholder="01XXXXXXXXX" value={num} onChange={e => setNum(e.target.value)} />}
        {m === 'Card' && <><Input label="Card number" placeholder="1234 5678 9012 3456" value={card.no} onChange={e => setCard({ ...card, no: e.target.value })} />
          <div className="grid grid-cols-2 gap-3"><Input label="Expiry (MM/YY)" value={card.exp} onChange={e => setCard({ ...card, exp: e.target.value })} /><Input label="CVV" type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} /></div></>}
        {m === 'Cash on Counter' && <p className="text-sm bg-amber-50 text-amber-800 p-3 rounded-xl">Pay at the counter before departure. Booking stays Pending until then.</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
        <p className="text-xs text-slate-500">Demo only: no real payment is processed.</p></div></div>
    <div><FareSummary bus={bus} date={draft.date} seats={draft.seats} fare={draft.fare} />
      <Button variant="secondary" className="w-full mt-4" disabled={busy} onClick={pay}>{busy && <Loader2 className="animate-spin" size={18} />}{busy ? 'Processing...' : 'Pay now'}</Button></div></div>
}
