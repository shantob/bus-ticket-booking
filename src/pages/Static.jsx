import { useState } from 'react'
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button, Input, Faq } from '../components/ui'
import { FAQS, Sec } from './Home'
import { useApp } from '../context/AppContext'
export function ContactForm() {
  const { toast } = useApp(); const [f, setF] = useState({ name: '', email: '', msg: '' }); const [e, setE] = useState({})
  const submit = ev => { ev.preventDefault(); const er = {}
    if (!f.name.trim()) er.name = 'Required'; if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Valid email required'; if (f.msg.trim().length < 10) er.msg = 'Write at least 10 characters'
    setE(er); if (!Object.keys(er).length) { toast('Message sent. We will reply soon.'); setF({ name: '', email: '', msg: '' }) } }
  return <form onSubmit={submit} className="space-y-3 bg-white border rounded-2xl p-5"><Input label="Name" value={f.name} error={e.name} onChange={x => setF({ ...f, name: x.target.value })} /><Input label="Email" value={f.email} error={e.email} onChange={x => setF({ ...f, email: x.target.value })} />
    <label className="block text-sm font-medium">Message<textarea rows={4} value={f.msg} onChange={x => setF({ ...f, msg: x.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>{e.msg && <p className="text-xs text-red-600">{e.msg}</p>}<Button type="submit">Send message</Button></form>
}
const POL = [['Booking policy', 'Tickets are issued after payment. Carry a printed or digital ticket and a valid ID.'], ['Refund policy', 'Cancel 24h+ before departure for 90% refund, 6-24h for 50%, under 6h no refund.'], ['Terms & conditions', 'Passengers must arrive 15 minutes early. Operators may change buses for safety reasons.'], ['Privacy policy', 'We store only the details needed for your booking and never sell personal data.']]
export const Help = () => <div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Help & Support</h1><p className="text-slate-600 mt-1">Call +880 1700-000000 or email support@ticketcounter.com</p>
  <Sec title="FAQ"><Faq items={FAQS} /></Sec><Sec title="Policies"><Faq items={POL} /></Sec><Sec title="Contact support"><ContactForm /></Sec></div>
export const About = () => <div className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold">About Ticket Counter</h1><p className="mt-3 text-slate-600 max-w-2xl">Ticket Counter started in Khulna to end long counter queues. Today we connect passengers on Khulna, Dhaka and Rajshahi routes with trusted operators.</p>
  <Sec title="Mission and vision"><div className="grid md:grid-cols-2 gap-4"><div className="p-5 rounded-2xl bg-blue-50"><b>Mission:</b> Make intercity bus travel simple, safe and transparent.</div><div className="p-5 rounded-2xl bg-green-50"><b>Vision:</b> Every Bangladeshi traveller books in under two minutes.</div></div></Sec>
  <Sec title="By the numbers"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[['50K+', 'Tickets sold'], ['120+', 'Daily trips'], ['25', 'Operators'], ['4.7', 'Avg. rating']].map(([n, l]) => <div key={l} className="p-5 rounded-2xl border text-center"><p className="text-3xl font-bold text-primary">{n}</p><p className="text-sm text-slate-500">{l}</p></div>)}</div></Sec>
  <Sec title="Our team"><div className="grid sm:grid-cols-3 gap-4">{[['Tanvir Ahmed', 'Founder & CEO'], ['Farzana Akter', 'Head of Operations'], ['Imran Hossain', 'Lead Engineer']].map(([n, r]) => <div key={n} className="p-5 rounded-2xl border text-center"><div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl mx-auto">{n[0]}</div><p className="font-bold mt-2">{n}</p><p className="text-sm text-slate-500">{r}</p></div>)}</div></Sec></div>
export const Contact = () => <div className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-6">Contact us</h1><div className="grid md:grid-cols-2 gap-6"><ContactForm />
  <div className="space-y-4"><div className="space-y-2"><p className="flex gap-2"><MapPin />Sonadanga Bus Terminal, Khulna 9100</p><p className="flex gap-2"><Phone />+880 1700-000000</p><p className="flex gap-2"><Mail />support@ticketcounter.com</p><div className="flex gap-3">{[Facebook, Twitter, Instagram].map((I, i) => <I key={i} />)}</div></div>
    <div className="h-56 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">Google Map placeholder</div></div></div></div>
export const NotFound = () => <div className="text-center py-24"><h1 className="text-6xl font-bold text-primary">404</h1><p className="mt-2">This page does not exist.</p></div>
