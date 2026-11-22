import { useState } from 'react'
import { Plus, Pencil, Trash2, Download } from 'lucide-react'
import { Badge, Button, ConfirmationDialog, Input, Modal, Pagination, Select, Table } from '../components/ui'
import { useApp } from '../context/AppContext'
import { CITIES, POINTS, TYPES } from '../data/mock'
import { taka } from '../utils/storage'
const Title = ({ children, right }) => <div className="flex justify-between items-center mb-4 gap-2"><h1 className="text-2xl font-bold">{children}</h1>{right}</div>

/** Generic CRUD table + modal form, driven by config (used for buses, routes, coupons, users) */
function Crud({ title, items, setItems, fields, cols, blank, prepare = x => x, canAdd = true, extra }) {
  const { toast } = useApp(); const [edit, setEdit] = useState(null); const [del, setDel] = useState(null); const [page, setPage] = useState(1); const [err, setErr] = useState('')
  const per = 8, rows = items.slice((page - 1) * per, page * per)
  const save = e => {
    e.preventDefault()
    if (fields.some(f => f.type !== 'checkbox' && String(edit[f.key] ?? '').trim() === '')) return setErr('Please fill all fields')
    const isNew = !items.some(i => i.id === edit.id); const v = prepare(edit)
    setItems(isNew ? [v, ...items] : items.map(i => i.id === v.id ? v : i)); toast(isNew ? 'Added' : 'Updated'); setEdit(null); setErr('')
  }
  const upd = (id, p) => setItems(items.map(i => i.id === id ? { ...i, ...p } : i))
  return <div><Title right={canAdd && <Button onClick={() => setEdit(blank())}><Plus size={16} />Add new</Button>}>{title}</Title>
    <Table rows={rows} cols={[...cols, { label: 'Actions', render: r => <div className="flex gap-2">{extra?.(r, upd)}{canAdd && <><button onClick={() => setEdit(r)} aria-label="Edit"><Pencil size={16} className="text-primary" /></button><button onClick={() => setDel(r)} aria-label="Delete"><Trash2 size={16} className="text-red-600" /></button></>}</div> }]} />
    <Pagination page={page} pages={Math.ceil(items.length / per)} onChange={setPage} />
    <Modal open={!!edit} onClose={() => { setEdit(null); setErr('') }} title={edit && items.some(i => i.id === edit.id) ? 'Edit' : 'Add new'}>
      {edit && <form onSubmit={save} className="space-y-3">{fields.map(f => f.type === 'select' ? <Select key={f.key} label={f.label} value={edit[f.key]} onChange={e => setEdit({ ...edit, [f.key]: e.target.value })} options={f.options} />
        : f.type === 'checkbox' ? <label key={f.key} className="flex gap-2 text-sm"><input type="checkbox" checked={!!edit[f.key]} onChange={e => setEdit({ ...edit, [f.key]: e.target.checked })} />{f.label}</label>
          : <Input key={f.key} label={f.label} type={f.type || 'text'} value={edit[f.key]} onChange={e => setEdit({ ...edit, [f.key]: f.type === 'number' ? +e.target.value : e.target.value })} />)}
        {err && <p className="text-sm text-red-600">{err}</p>}<Button type="submit" className="w-full">Save</Button></form>}</Modal>
    <ConfirmationDialog open={!!del} onClose={() => setDel(null)} title="Delete this item?" message="This action cannot be undone." confirmText="Delete" onConfirm={() => { setItems(items.filter(i => i.id !== del.id)); toast('Deleted') }} /></div>
}
const city = { type: 'select', options: CITIES }
export function ManageBuses() {
  const { buses, setBuses } = useApp()
  return <Crud title="Manage buses" items={buses} setItems={setBuses}
    fields={[{ key: 'operator', label: 'Operator' }, { key: 'type', label: 'Type', type: 'select', options: TYPES }, { key: 'from', label: 'From', ...city }, { key: 'to', label: 'To', ...city }, { key: 'departure', label: 'Departure (HH:MM)' }, { key: 'arrival', label: 'Arrival (HH:MM)' }, { key: 'price', label: 'Price (৳)', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }]}
    cols={[{ label: 'Operator', key: 'operator' }, { label: 'Type', key: 'type' }, { label: 'Route', render: r => `${r.from} → ${r.to}` }, { label: 'Time', render: r => `${r.departure}–${r.arrival}` }, { label: 'Price', render: r => taka(r.price) }, { label: 'Status', render: r => <Badge>{r.status}</Badge> }]}
    blank={() => ({ id: 'b' + Date.now(), operator: '', type: 'AC', from: 'Khulna', to: 'Dhaka', departure: '', arrival: '', price: 1000, status: 'Active' })}
    prepare={b => ({ duration: 6, totalSeats: 40, booked: [], rating: 4.2, amenities: ['WiFi', 'Water'], number: 'METRO-' + String(b.id).slice(-4), ...b, boarding: POINTS[b.from], dropping: POINTS[b.to] })} />
}
export function ManageRoutes() {
  const { routes, setRoutes } = useApp()
  return <Crud title="Manage routes & base prices" items={routes} setItems={setRoutes}
    fields={[{ key: 'from', label: 'From', ...city }, { key: 'to', label: 'To', ...city }, { key: 'duration', label: 'Duration (hours)', type: 'number' }, { key: 'basePrice', label: 'Base price (৳)', type: 'number' }]}
    cols={[{ label: 'Route', render: r => `${r.from} → ${r.to}` }, { label: 'Duration', render: r => r.duration + ' hrs' }, { label: 'Base price', render: r => taka(r.basePrice) }]}
    blank={() => ({ id: 'r' + Date.now(), from: 'Khulna', to: 'Dhaka', duration: 6, basePrice: 800 })} />
}
export function ManageCoupons() {
  const { coupons, setCoupons } = useApp()
  return <Crud title="Manage coupons" items={coupons} setItems={setCoupons} prepare={c => ({ ...c, code: c.code.toUpperCase() })}
    fields={[{ key: 'code', label: 'Code' }, { key: 'type', label: 'Type', type: 'select', options: ['percent', 'flat'] }, { key: 'value', label: 'Value', type: 'number' }, { key: 'minOrder', label: 'Minimum order (৳)', type: 'number' }, { key: 'active', label: 'Active', type: 'checkbox' }]}
    cols={[{ label: 'Code', key: 'code' }, { label: 'Discount', render: r => r.type === 'percent' ? r.value + '%' : taka(r.value) }, { label: 'Min order', render: r => taka(r.minOrder) }, { label: 'Status', render: r => <Badge>{r.active ? 'Active' : 'Inactive'}</Badge> }]}
    blank={() => ({ id: 'c' + Date.now(), code: '', type: 'percent', value: 10, minOrder: 500, active: true })} />
}
export function ManageUsers() {
  const { users, setUsers, toast } = useApp(); const [d, setD] = useState(null)
  return <><Crud title="Manage users" items={users} setItems={setUsers} canAdd={false} fields={[]} blank={() => ({})}
    cols={[{ label: 'Name', key: 'name' }, { label: 'Email', key: 'email' }, { label: 'Phone', key: 'phone' }, { label: 'Status', render: r => <Badge>{r.blocked ? 'Blocked' : 'Active'}</Badge> }]}
    extra={(r, upd) => <><Button variant="outline" className="!py-1 !px-2 text-xs" onClick={() => setD(r)}>Details</Button><Button variant={r.blocked ? 'secondary' : 'danger'} className="!py-1 !px-2 text-xs" onClick={() => { upd(r.id, { blocked: !r.blocked }); toast(r.blocked ? 'User unblocked' : 'User blocked') }}>{r.blocked ? 'Unblock' : 'Block'}</Button></>} />
    <Modal open={!!d} onClose={() => setD(null)} title="User details">{d && <div className="space-y-1 text-sm"><p><b>Name:</b> {d.name}</p><p><b>Email:</b> {d.email}</p><p><b>Phone:</b> {d.phone}</p><p><b>Points:</b> {d.points}</p><p><b>Saved passengers:</b> {d.saved.length}</p></div>}</Modal></>
}
export function ManageBookings() {
  const { bookings, updateBooking, toast } = useApp(); const [q, setQ] = useState(''); const [st, setSt] = useState('All'); const [d, setD] = useState(null); const [page, setPage] = useState(1)
  const list = bookings.filter(b => (st === 'All' || b.status === st) && (b.id + b.passengers[0].name + b.bus.from + b.bus.to).toLowerCase().includes(q.toLowerCase()))
  return <div><Title>Manage bookings</Title><div className="grid sm:grid-cols-2 gap-3 mb-4 max-w-xl"><Input label="Search" placeholder="ID, name or city" value={q} onChange={e => { setQ(e.target.value); setPage(1) }} /><Select label="Status" value={st} onChange={e => setSt(e.target.value)} options={['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed']} /></div>
    <Table rows={list.slice((page - 1) * 8, page * 8)} cols={[{ label: 'ID', key: 'id' }, { label: 'Passenger', render: r => r.passengers[0].name }, { label: 'Route', render: r => `${r.bus.from} → ${r.bus.to}` }, { label: 'Date', key: 'date' }, { label: 'Total', render: r => taka(r.fare.total) }, { label: 'Status', render: r => <Badge>{r.status}</Badge> }, { label: 'Actions', render: r => <Button variant="outline" className="!py-1 !px-2 text-xs" onClick={() => setD(r)}>Details</Button> }]} />
    <Pagination page={page} pages={Math.ceil(list.length / 8)} onChange={setPage} />
    <Modal open={!!d} onClose={() => setD(null)} title={'Booking ' + d?.id}>{d && <div className="space-y-2 text-sm"><p>{d.bus.operator}: {d.bus.from} → {d.bus.to}, {d.date} {d.bus.departure}</p><p>Seats: {d.seats.join(', ')} · {taka(d.fare.total)} via {d.method}</p><p>Passengers: {d.passengers.map(p => p.name).join(', ')}</p>
      <Select label="Change status" value={d.status} onChange={e => { updateBooking(d.id, { status: e.target.value }); setD({ ...d, status: e.target.value }); toast('Status updated') }} options={['Confirmed', 'Pending', 'Cancelled', 'Completed']} />
      <Button variant="danger" onClick={() => { updateBooking(d.id, { status: 'Cancelled' }); setD(null); toast('Booking cancelled') }}>Cancel booking</Button></div>}</Modal></div>
}
const Bars = ({ data }) => { const m = Math.max(1, ...data.map(d => d[1])); return <div className="space-y-2">{data.map(([l, v, t]) => <div key={l} className="flex items-center gap-2 text-sm"><span className="w-36 truncate">{l}</span><div className="flex-1 bg-slate-100 rounded h-4"><div className="bg-primary h-4 rounded" style={{ width: v / m * 100 + '%' }} /></div><span className="w-20 text-right">{t ?? v}</span></div>)}</div> }
const sumBy = (bs, key) => Object.entries(bs.reduce((a, b) => { const k = key(b); a[k] = (a[k] || 0) + b.fare.total; return a }, {}))
export function Dashboard() {
  const { bookings, buses, routes, users } = useApp(); const rev = bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.fare.total, 0)
  const stats = [['Total bookings', bookings.length], ['Total revenue', taka(rev)], ['Total buses', buses.length], ['Total routes', routes.length], ['Total users', users.length]]
  const cnt = ['Confirmed', 'Pending', 'Cancelled', 'Completed'].map(s => [s, bookings.filter(b => b.status === s).length])
  return <div><Title>Dashboard</Title><div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">{stats.map(([l, v]) => <div key={l} className="bg-white border rounded-2xl p-4"><p className="text-sm text-slate-500">{l}</p><p className="text-2xl font-bold text-primary">{v}</p></div>)}</div>
    <div className="grid lg:grid-cols-2 gap-4 mb-6"><div className="bg-white border rounded-2xl p-4"><h3 className="font-bold mb-3">Booking status</h3><Bars data={cnt} /></div><div className="bg-white border rounded-2xl p-4"><h3 className="font-bold mb-3">Revenue by route</h3><Bars data={sumBy(bookings.filter(b => b.status !== 'Cancelled'), b => `${b.bus.from}-${b.bus.to}`).map(([l, v]) => [l, v, taka(v)])} /></div></div>
    <h3 className="font-bold mb-2">Recent bookings</h3><Table rows={bookings.slice(0, 5)} cols={[{ label: 'ID', key: 'id' }, { label: 'Passenger', render: r => r.passengers[0].name }, { label: 'Route', render: r => `${r.bus.from} → ${r.bus.to}` }, { label: 'Total', render: r => taka(r.fare.total) }, { label: 'Status', render: r => <Badge>{r.status}</Badge> }]} /></div>
}
export function Reports() {
  const { bookings, toast } = useApp(); const [from, setFrom] = useState(''); const [to, setTo] = useState('')
  const bs = bookings.filter(b => (!from || b.createdAt >= from) && (!to || b.createdAt <= to)); const ok = bs.filter(b => b.status !== 'Cancelled')
  return <div><Title right={<Button variant="outline" onClick={() => toast('Export started (UI only)')}><Download size={16} />Export</Button>}>Reports</Title>
    <div className="grid grid-cols-2 gap-3 max-w-md mb-5"><Input label="From date" type="date" value={from} onChange={e => setFrom(e.target.value)} /><Input label="To date" type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="bg-white border rounded-2xl p-4"><h3 className="font-bold mb-3">Sales report</h3><p className="text-3xl font-bold text-secondary mb-3">{taka(ok.reduce((s, b) => s + b.fare.total, 0))}</p><Bars data={sumBy(ok, b => b.createdAt).map(([l, v]) => [l, v, taka(v)])} /></div>
      <div className="bg-white border rounded-2xl p-4"><h3 className="font-bold mb-3">Booking report</h3><Bars data={['Confirmed', 'Pending', 'Cancelled', 'Completed'].map(s => [s, bs.filter(b => b.status === s).length])} /></div>
      <div className="bg-white border rounded-2xl p-4"><h3 className="font-bold mb-3">Route-wise report</h3><Bars data={sumBy(ok, b => `${b.bus.from}-${b.bus.to}`).map(([l, v]) => [l, v, taka(v)])} /></div></div></div>
}
