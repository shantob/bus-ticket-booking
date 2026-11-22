import { Link } from 'react-router-dom'
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
export default function Footer() {
  return <footer className="bg-slate-900 text-slate-300 mt-16"><div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    <div><div className="flex items-center gap-2 text-white text-xl font-bold"><Bus />Ticket Counter</div><p className="mt-3 text-sm">Bangladesh's trusted bus ticket booking platform for Khulna, Dhaka and Rajshahi.</p>
      <div className="flex gap-3 mt-4">{[Facebook, Twitter, Instagram, Youtube].map((I, i) => <a key={i} href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-primary"><I size={16} /></a>)}</div></div>
    <div><h4 className="text-white font-semibold mb-3">Quick Links</h4><ul className="space-y-2 text-sm">{[['/search', 'Book Tickets'], ['/my-bookings', 'My Bookings'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([t, l]) => <li key={t}><Link to={t} className="hover:text-white">{l}</Link></li>)}</ul></div>
    <div><h4 className="text-white font-semibold mb-3">Support</h4><ul className="space-y-2 text-sm">{['Help Center', 'Booking Policy', 'Refund Policy', 'Terms & Conditions', 'Privacy Policy'].map(l => <li key={l}><Link to="/help" className="hover:text-white">{l}</Link></li>)}<li><Link to="/admin/login" className="hover:text-white">Admin Login</Link></li></ul></div>
    <div className="space-y-2 text-sm"><h4 className="text-white font-semibold mb-3">Contact</h4><p className="flex gap-2"><Phone size={16} />+880 1700-000000</p><p className="flex gap-2"><Mail size={16} />support@ticketcounter.com</p><p className="flex gap-2"><MapPin size={16} />Sonadanga, Khulna 9100</p></div>
  </div><div className="border-t border-slate-800 py-4 text-center text-sm">© {new Date().getFullYear()} Ticket Counter. Demo project, no real payments.</div></footer>
}
