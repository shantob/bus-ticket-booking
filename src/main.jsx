import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes/AppRoutes'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><AppProvider><AppRoutes /></AppProvider></BrowserRouter>)
