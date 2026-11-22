// Reusable UI primitives: Button, Input, Select, Badge, Modal, ConfirmationDialog, EmptyState, LoadingSkeleton, Table, Pagination, Toast, Faq
import { useState } from 'react'
import { X, Inbox, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
export const cx = (...a) => a.filter(Boolean).join(' ')
const V = { primary: 'bg-primary text-white hover:bg-blue-800', secondary: 'bg-secondary text-white hover:bg-green-700', accent: 'bg-accent text-white hover:bg-orange-600', outline: 'border border-slate-300 hover:bg-slate-50', danger: 'bg-red-600 text-white hover:bg-red-700' }
export const Button = ({ variant = 'primary', className, ...p }) => <button {...p} className={cx('px-4 py-2.5 rounded-xl font-semibold transition disabled:opacity-50 inline-flex items-center justify-center gap-2', V[variant], className)} />
const field = e => cx('mt-1 w-full rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 bg-white', e ? 'border-red-500' : 'border-slate-300')
export const Input = ({ label, error, right, ...p }) => (
  <label className="block text-sm"><span className="font-medium text-slate-700">{label}</span>
    <div className="relative"><input {...p} className={field(error)} />{right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}</div>
    {error && <span className="text-xs text-red-600">{error}</span>}</label>)
export const Select = ({ label, options, error, ...p }) => (
  <label className="block text-sm"><span className="font-medium text-slate-700">{label}</span>
    <select {...p} className={field(error)}>{options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>
    {error && <span className="text-xs text-red-600">{error}</span>}</label>)
const BC = { Confirmed: 'bg-green-100 text-green-700', Pending: 'bg-amber-100 text-amber-700', Cancelled: 'bg-red-100 text-red-700', Completed: 'bg-blue-100 text-blue-700', Active: 'bg-green-100 text-green-700', Inactive: 'bg-slate-200 text-slate-600', Blocked: 'bg-red-100 text-red-700' }
export const Badge = ({ children, color }) => <span className={cx('px-2.5 py-1 rounded-full text-xs font-semibold', color || BC[children] || 'bg-slate-100 text-slate-700')}>{children}</span>
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={onClose}>
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{title}</h3><button onClick={onClose} aria-label="Close"><X size={20} /></button></div>{children}</div></div>
}
export const ConfirmationDialog = ({ open, title, message, onConfirm, onClose, confirmText = 'Confirm' }) => (
  <Modal open={open} onClose={onClose} title={title}><p className="text-slate-600 mb-5">{message}</p>
    <div className="flex gap-3 justify-end"><Button variant="outline" onClick={onClose}>No, go back</Button><Button variant="danger" onClick={() => { onConfirm(); onClose() }}>{confirmText}</Button></div></Modal>)
export const EmptyState = ({ title, text, action }) => <div className="text-center py-16 px-4"><Inbox className="mx-auto text-slate-300" size={56} /><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="text-slate-500 mt-1">{text}</p><div className="mt-4">{action}</div></div>
export const LoadingSkeleton = ({ count = 4 }) => <div className="space-y-4">{Array.from({ length: count }, (_, i) => <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />)}</div>
export const Table = ({ cols, rows, empty = 'No data found' }) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-sm text-left">
    <thead className="bg-slate-50 text-slate-600"><tr>{cols.map(c => <th key={c.label} className="px-4 py-3 font-semibold whitespace-nowrap">{c.label}</th>)}</tr></thead>
    <tbody>{rows.length ? rows.map((r, i) => <tr key={r.id || i} className="border-t border-slate-100 hover:bg-slate-50">{cols.map(c => <td key={c.label} className="px-4 py-3 whitespace-nowrap">{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)
      : <tr><td colSpan={cols.length} className="p-8 text-center text-slate-500">{empty}</td></tr>}</tbody></table></div>)
export const Pagination = ({ page, pages, onChange }) => pages > 1 && (
  <div className="flex justify-center gap-1 mt-4">{Array.from({ length: pages }, (_, i) => <button key={i} onClick={() => onChange(i + 1)} className={cx('w-9 h-9 rounded-lg text-sm', page === i + 1 ? 'bg-primary text-white' : 'bg-white border hover:bg-slate-50')}>{i + 1}</button>)}</div>)
export function ToastContainer() {
  const { toasts } = useApp()
  return <div className="fixed top-20 right-4 z-[60] space-y-2">{toasts.map(t => <div key={t.id} className={cx('flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-lg', t.type === 'error' ? 'bg-red-600' : 'bg-secondary')}>{t.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}{t.msg}</div>)}</div>
}
export function Faq({ items }) {
  const [o, setO] = useState(0)
  return <div className="space-y-3">{items.map(([q, a], i) => <div key={q} className="border rounded-xl bg-white">
    <button className="w-full flex justify-between items-center p-4 font-semibold text-left" onClick={() => setO(o === i ? -1 : i)}>{q}<ChevronDown className={cx('transition shrink-0', o === i && 'rotate-180')} size={18} /></button>
    {o === i && <p className="px-4 pb-4 text-slate-600">{a}</p>}</div>)}</div>
}
