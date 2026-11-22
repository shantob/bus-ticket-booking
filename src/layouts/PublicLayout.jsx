import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ToastContainer } from '../components/ui'
export default function PublicLayout() {
  const { pathname } = useLocation()
  return <div className="min-h-screen flex flex-col"><Navbar /><ToastContainer /><main key={pathname} className="page flex-1"><Outlet /></main><Footer /></div>
}
