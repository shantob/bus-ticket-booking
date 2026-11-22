import { cx } from './ui'
export const LADIES = ['A1', 'B1', 'A2', 'B2']
/** Interactive 10-row x 4-col layout. States: available, selected, booked, ladies */
export default function SeatMap({ taken, selected, onToggle }) {
  const Seat = ({ id }) => {
    const booked = taken.has(id), sel = selected.includes(id), ladies = LADIES.includes(id)
    return <button type="button" disabled={booked} onClick={() => onToggle(id)} title={ladies ? 'Ladies seat' : id}
      className={cx('w-11 h-11 rounded-lg text-xs font-semibold border-2 transition', booked && 'bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed',
        !booked && sel && 'bg-secondary border-secondary text-white', !booked && !sel && ladies && 'bg-pink-50 border-pink-400 text-pink-700 hover:bg-pink-100', !booked && !sel && !ladies && 'bg-white border-primary text-primary hover:bg-blue-50')}>{id}</button>
  }
  const L = [['bg-white border-2 border-primary', 'Available'], ['bg-secondary', 'Selected'], ['bg-slate-300', 'Booked'], ['bg-pink-100 border-2 border-pink-400', 'Ladies']]
  return <div><div className="flex flex-wrap gap-4 text-sm mb-4">{L.map(([c, t]) => <span key={t} className="flex items-center gap-1.5"><i className={'w-4 h-4 rounded ' + c} />{t}</span>)}</div>
    <div className="inline-block border-2 rounded-3xl p-4 bg-slate-50"><p className="text-right text-xs text-slate-500 mb-2">Driver 🚌</p>
      {Array.from({ length: 10 }, (_, r) => <div key={r} className="flex gap-2 mb-2">{['A', 'B'].map(c => <Seat key={c} id={c + (r + 1)} />)}<div className="w-8" />{['C', 'D'].map(c => <Seat key={c} id={c + (r + 1)} />)}</div>)}</div></div>
}
