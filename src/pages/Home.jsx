import { Link } from 'react-router-dom'
import { ShieldCheck, Headphones, Wallet, Zap, Search, Armchair, CreditCard, Ticket, Star, ArrowRight } from 'lucide-react'
import SearchForm from '../components/SearchForm'
import { Faq } from '../components/ui'
import { OPERATORS } from '../data/mock'
import { today } from '../utils/storage'
export const FAQS = [['How do I book a ticket?', 'Search your route, pick a bus, choose seats, enter passenger details and pay.'], ['Can I cancel my booking?', 'Yes, from My Bookings. Refunds follow our refund policy.'], ['Which payment methods are supported?', 'bKash, Nagad, Rocket, Card and Cash on Counter (demo only).'], ['How many seats can I book?', 'Up to 6 seats per booking.']]
const pop = [['Khulna', 'Dhaka', 'From ৳720'], ['Dhaka', 'Rajshahi', 'From ৳600'], ['Khulna', 'Rajshahi', 'From ৳640']]
export default function Home() {
  return <>
    <section className="bg-gradient-to-br from-primary to-blue-900 text-white pt-16 pb-28 px-4"><div className="max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">Khulna, Dhaka, Rajshahi. Book your bus seat in minutes.</h1>
      <p className="mt-4 text-blue-100 max-w-xl">Compare operators, pick your exact seat and travel with confidence on Bangladesh's busiest highways.</p></div></section>
    <div className="max-w-7xl mx-auto px-4 -mt-16"><SearchForm /></div>
    <Sec title="Popular routes"><div className="grid gap-4 md:grid-cols-3">{pop.map(([f, t, p]) => <Link key={f + t} to={`/search?from=${f}&to=${t}&date=${today()}&pax=1&type=All`} className="group p-6 rounded-2xl border hover:shadow-lg hover:border-primary transition bg-white">
      <p className="text-xl font-bold flex items-center gap-2">{f}<ArrowRight size={18} className="text-accent" />{t}</p><p className="text-secondary font-semibold mt-1">{p}</p></Link>)}</div></Sec>
    <Sec title="Featured bus operators"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{OPERATORS.map(o => <div key={o} className="p-5 rounded-2xl bg-slate-50 text-center font-semibold">{o}</div>)}</div></Sec>
    <Sec title="Why choose Ticket Counter"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[ShieldCheck, 'Safe and verified', 'Every operator is checked for licence and fitness.'], [Wallet, 'Best prices', 'Transparent fares with no hidden fees.'], [Zap, 'Instant tickets', 'Get your e-ticket as soon as you pay.'], [Headphones, '24/7 support', 'Call or message us any time.']].map(([I, t, d]) => <div key={t} className="p-6 rounded-2xl border bg-white"><I className="text-primary" size={30} /><h3 className="font-bold mt-3">{t}</h3><p className="text-sm text-slate-600 mt-1">{d}</p></div>)}</div></Sec>
    <Sec title="How booking works"><ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[Search, 'Search', 'Enter route, date and passengers.'], [Armchair, 'Pick seats', 'Choose your seats on the live map.'], [CreditCard, 'Pay', 'Use bKash, Nagad, Rocket or card.'], [Ticket, 'Travel', 'Show your e-ticket at boarding.']].map(([I, t, d]) => <li key={t} className="p-6 rounded-2xl bg-blue-50"><I className="text-primary" /><h3 className="font-bold mt-2">{t}</h3><p className="text-sm text-slate-600">{d}</p></li>)}</ol></Sec>
    <Sec title="What our customers say"><div className="grid gap-4 md:grid-cols-3">{[['Nusrat J.', 'Booked Khulna to Dhaka in two minutes. Seat was exactly as shown.'], ['Mahmud H.', 'The Rajshahi night coach was clean and right on time.'], ['Tania A.', 'Ladies seats and clear boarding points made me feel safe.']].map(([n, t]) => <div key={n} className="p-6 rounded-2xl border bg-white"><div className="flex text-accent">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}</div><p className="mt-2 text-slate-700">"{t}"</p><p className="mt-3 font-semibold">{n}</p></div>)}</div></Sec>
    <Sec title="Frequently asked questions"><div className="max-w-3xl"><Faq items={FAQS} /></div></Sec>
  </>
}
export const Sec = ({ title, children }) => <section className="max-w-7xl mx-auto px-4 mt-14"><h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>{children}</section>
