import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../components/ui'
import { useApp } from '../context/AppContext'
const Shell = ({ title, children }) => <div className="min-h-[70vh] flex items-center justify-center px-4 py-10"><div className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-6"><h1 className="text-2xl font-bold mb-4">{title}</h1>{children}</div></div>
const Eyes = ({ show, set }) => <button type="button" onClick={() => set(!show)} aria-label="Toggle password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
const Social = () => <div className="grid grid-cols-2 gap-2 mt-4">{['Google', 'Facebook'].map(s => <Button key={s} type="button" variant="outline" onClick={() => alert(s + ' login is UI only in this demo')}>{s}</Button>)}</div>
/** Shared login form for users and admin */
export function LoginForm({ admin }) {
  const { login, toast } = useApp(); const nav = useNavigate(); const loc = useLocation()
  const [f, setF] = useState({ email: '', password: '' }); const [show, setShow] = useState(false); const [err, setErr] = useState({})
  const submit = e => {
    e.preventDefault(); const er = {}
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    if (f.password.length < 6) er.password = 'Minimum 6 characters'
    setErr(er); if (Object.keys(er).length) return
    const r = login(f.email, f.password)
    if (r === 'blocked') return toast('Your account is blocked', 'error')
    if (!r || (admin && r !== 'admin')) return toast('Wrong email or password', 'error')
    toast('Welcome back!'); nav(admin ? '/admin' : r === 'admin' ? '/admin' : loc.state?.from || '/profile')
  }
  return <form onSubmit={submit} className="space-y-3">
    <Input label="Email" type="email" value={f.email} error={err.email} onChange={e => setF({ ...f, email: e.target.value })} />
    <Input label="Password" type={show ? 'text' : 'password'} value={f.password} error={err.password} onChange={e => setF({ ...f, password: e.target.value })} right={<Eyes show={show} set={setShow} />} />
    {!admin && <Link to="/forgot-password" className="text-sm text-primary">Forgot password?</Link>}
    <Button className="w-full" type="submit">Login</Button>
    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">Demo: {admin ? 'admin@ticketcounter.com / admin123' : 'user@demo.com / 123456'}</p>
    {!admin && <><Social /><p className="text-sm text-center mt-3">New here? <Link to="/register" className="text-primary font-semibold">Create account</Link></p></>}</form>
}
export const Login = () => <Shell title="Login to Ticket Counter"><LoginForm /></Shell>
export const AdminLogin = () => <Shell title="Admin login"><LoginForm admin /></Shell>
export function Register() {
  const { register, toast } = useApp(); const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' }); const [show, setShow] = useState(false); const [err, setErr] = useState({})
  const submit = e => {
    e.preventDefault(); const er = {}
    if (f.name.trim().length < 3) er.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    if (!/^01[3-9]\d{8}$/.test(f.phone)) er.phone = 'Enter a valid BD number'
    if (f.password.length < 6) er.password = 'Minimum 6 characters'
    setErr(er); if (Object.keys(er).length) return
    if (!register(f)) return toast('This email is already registered', 'error')
    toast('Account created'); nav('/profile')
  }
  const s = k => e => setF({ ...f, [k]: e.target.value })
  return <Shell title="Create your account"><form onSubmit={submit} className="space-y-3">
    <Input label="Full name" value={f.name} error={err.name} onChange={s('name')} /><Input label="Email" type="email" value={f.email} error={err.email} onChange={s('email')} />
    <Input label="Phone" value={f.phone} error={err.phone} onChange={s('phone')} />
    <Input label="Password" type={show ? 'text' : 'password'} value={f.password} error={err.password} onChange={s('password')} right={<Eyes show={show} set={setShow} />} />
    <Button className="w-full" type="submit">Register</Button><Social /><p className="text-sm text-center mt-3">Already registered? <Link to="/login" className="text-primary font-semibold">Login</Link></p></form></Shell>
}
export function Forgot() {
  const { toast } = useApp(); const [e, setE] = useState('')
  return <Shell title="Reset password"><form className="space-y-3" onSubmit={x => { x.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(e)) return toast('Enter a valid email', 'error'); toast('Reset link sent (demo)') }}>
    <Input label="Email" type="email" value={e} onChange={x => setE(x.target.value)} /><Button className="w-full" type="submit">Send reset link</Button><Link to="/login" className="block text-center text-sm text-primary">Back to login</Link></form></Shell>
}
