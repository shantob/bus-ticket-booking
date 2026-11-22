import { useState, useEffect } from 'react'
/** useState that mirrors its value into localStorage (mock persistence) */
export function usePersist(key, init) {
  const [v, s] = useState(() => { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : init } catch { return init } })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, s]
}
export const taka = n => '৳' + Number(n).toLocaleString('en-IN')
export const today = () => new Date().toISOString().slice(0, 10)
export const seatLabel = i => 'ABCD'[i % 4] + (Math.floor(i / 4) + 1)
