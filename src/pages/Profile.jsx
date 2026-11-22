import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Trash2, Gift } from 'lucide-react'
import { Button, Input, Select, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
const TABS = ['Profile', 'Password', 'Saved passengers', 'Wallet']
export default function Profile() {
  const { user, updateUser, logout, toast } = useApp(); const nav = useNavigate(); const [tab, setTab] = useState('Profile')
  const [f, setF] = useState({ name: user?.name || '', phone: user?.phone || '' }); const [pw, setPw] = useState({ cur: '', n: '', c: '' }); const [sp, setSp] = useState({ name: '', age: '', gender: 'Male' })
  if (!user) return <Navigate to="/login" state={{ from: '/profile' }} replace />
  const saveInfo = e => { e.preventDefault(); if (f.name.trim().length < 3 || !/^01[3-9]\d{8}$/.test(f.phone)) return toast('Check name and phone number', 'error'); updateUser(user.id, f); toast('Profile updated') }
  const savePw = e => { e.preventDefault(); if (pw.cur !== user.password) return toast('Current password is wrong', 'error'); if (pw.n.length < 6 || pw.n !== pw.c) return toast('New passwords must match (min 6 chars)', 'error'); updateUser(user.id, { password: pw.n }); setPw({ cur: '', n: '', c: '' }); toast('Password changed') }
  const addP = e => { e.preventDefault(); if (sp.name.trim().length < 3 || !(+sp.age > 0)) return toast('Enter name and age', 'error'); updateUser(user.id, { saved: [...user.saved, sp] }); setSp({ name: '', age: '', gender: 'Male' }); toast('Passenger saved') }
  return <div className="max-w-4xl mx-auto px-4 py-8"><div className="flex flex-wrap justify-between items-center gap-3 mb-6"><div><h1 className="text-3xl font-bold">{user.name}</h1><p className="text-slate-500">{user.email}</p></div>
    <div className="flex gap-2"><Link to="/my-bookings"><Button variant="outline">My bookings</Button></Link><Button variant="danger" onClick={() => { logout(); toast('Logged out'); nav('/') }}>Logout</Button></div></div>
    <div className="flex gap-2 mb-5 overflow-x-auto">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={cx('px-4 py-2 rounded-xl whitespace-nowrap', tab === t ? 'bg-primary text-white' : 'bg-slate-100')}>{t}</button>)}</div>
    <div className="bg-white border rounded-2xl p-5">
      {tab === 'Profile' && <form onSubmit={saveInfo} className="grid sm:grid-cols-2 gap-3 max-w-xl"><Input label="Full name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /><Input label="Phone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /><Input label="Email" value={user.email} disabled /><div className="sm:col-span-2"><Button type="submit">Save changes</Button></div></form>}
      {tab === 'Password' && <form onSubmit={savePw} className="space-y-3 max-w-sm"><Input label="Current password" type="password" value={pw.cur} onChange={e => setPw({ ...pw, cur: e.target.value })} /><Input label="New password" type="password" value={pw.n} onChange={e => setPw({ ...pw, n: e.target.value })} /><Input label="Confirm new password" type="password" value={pw.c} onChange={e => setPw({ ...pw, c: e.target.value })} /><Button type="submit">Change password</Button></form>}
      {tab === 'Saved passengers' && <div><ul className="divide-y mb-4">{user.saved.length ? user.saved.map((p, i) => <li key={i} className="py-2 flex justify-between">{p.name} ({p.gender}, {p.age})<button onClick={() => updateUser(user.id, { saved: user.saved.filter((_, j) => j !== i) })} aria-label="Remove"><Trash2 size={16} className="text-red-500" /></button></li>) : <li className="py-2 text-slate-500">No saved passengers yet.</li>}</ul>
        <form onSubmit={addP} className="grid sm:grid-cols-4 gap-3 items-end"><Input label="Name" value={sp.name} onChange={e => setSp({ ...sp, name: e.target.value })} /><Input label="Age" type="number" value={sp.age} onChange={e => setSp({ ...sp, age: e.target.value })} /><Select label="Gender" value={sp.gender} onChange={e => setSp({ ...sp, gender: e.target.value })} options={['Male', 'Female', 'Other']} /><Button type="submit">Add</Button></form></div>}
      {tab === 'Wallet' && <div className="text-center py-6"><Gift className="mx-auto text-accent" size={44} /><p className="text-4xl font-bold mt-2">{user.points} points</p><p className="text-slate-500 mt-1">Earn 1 point for every ৳20 spent. Redemption coming soon (UI only).</p></div>}</div></div>
}
