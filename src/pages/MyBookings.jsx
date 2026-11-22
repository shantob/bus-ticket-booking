import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import BookingCard, { effStatus } from '../components/BookingCard'
import TicketView from '../components/TicketView'
import { Button, ConfirmationDialog, EmptyState, Modal, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled']
export default function MyBookings() {
  const { user, bookings, updateBooking, toast } = useApp(); const [tab, setTab] = useState('All'); const [view, setView] = useState(null); const [cancel, setCancel] = useState(null)
  if (!user) return <Navigate to="/login" state={{ from: '/my-bookings' }} replace />
  const mine = bookings.filter(b => b.userId === user.id)
  const list = mine.filter(b => { const s = effStatus(b); return tab === 'All' || (tab === 'Upcoming' ? ['Confirmed', 'Pending'].includes(s) : s === tab) })
  return <div className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-4">My bookings</h1>
    <div className="flex gap-2 mb-6 overflow-x-auto">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={cx('px-4 py-2 rounded-xl font-medium', tab === t ? 'bg-primary text-white' : 'bg-slate-100')}>{t}</button>)}</div>
    {list.length ? <div className="grid md:grid-cols-2 gap-4">{list.map(b => <BookingCard key={b.id} b={b} onView={setView} onCancel={setCancel} />)}</div>
      : <EmptyState title="No bookings here" text="Your trips will show up on this page." action={<Link to="/"><Button>Book a ticket</Button></Link>} />}
    <Modal open={!!view} onClose={() => setView(null)} title="Ticket details">{view && <TicketView b={view} />}</Modal>
    <ConfirmationDialog open={!!cancel} onClose={() => setCancel(null)} title="Cancel this booking?" message={`Booking ${cancel?.id} will be cancelled and seats released.`} confirmText="Yes, cancel" onConfirm={() => { updateBooking(cancel.id, { status: 'Cancelled' }); toast('Booking cancelled') }} /></div>
}
