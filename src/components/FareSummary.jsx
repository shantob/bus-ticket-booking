import { taka } from '../utils/storage'
export const SERVICE_PER_SEAT = 30
/** Compute fare: base + service charge - discount */
export const calcFare = (price, seats, discount = 0) => { const base = price * seats, service = SERVICE_PER_SEAT * seats; return { base, service, discount, total: Math.max(0, base + service - discount) } }
export default function FareSummary({ bus, date, seats, fare }) {
  return <aside className="bg-white border rounded-2xl p-5 shadow-sm h-fit lg:sticky lg:top-24">
    <h3 className="font-bold text-lg mb-3">Fare Summary</h3>
    <p className="text-sm text-slate-600">{bus.operator} ({bus.type})<br />{bus.from} → {bus.to}, {date}<br />{bus.departure} – {bus.arrival}</p>
    <p className="text-sm mt-2">Seats: <b>{seats.length ? seats.join(', ') : 'None selected'}</b></p>
    <div className="border-t mt-3 pt-3 space-y-2 text-sm">
      <div className="flex justify-between"><span>Base fare ({seats.length} × {taka(bus.price)})</span><span>{taka(fare.base)}</span></div>
      <div className="flex justify-between"><span>Service charge</span><span>{taka(fare.service)}</span></div>
      {fare.discount > 0 && <div className="flex justify-between text-secondary"><span>Discount</span><span>-{taka(fare.discount)}</span></div>}
      <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span className="text-primary">{taka(fare.total)}</span></div></div></aside>
}
