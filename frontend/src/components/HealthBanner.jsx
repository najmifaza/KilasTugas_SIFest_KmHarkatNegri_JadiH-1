import React, { useEffect, useState } from 'react'
import { checkHealth } from '../api'

export default function HealthBanner() {
  const [status, setStatus] = useState({ loading: true, ok: false, message: '' })

  const ping = async () => {
    try {
      const data = await checkHealth()
      setStatus({ loading: false, ok: true, message: data.app || 'Online' })
    } catch (err) {
      setStatus({
        loading: false,
        ok: false,
        message: 'Offline',
      })
    }
  }

  useEffect(() => {
    ping()
    const timer = setInterval(ping, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <button
      onClick={ping}
      title={status.ok ? 'Backend VPS Online' : 'Koneksi API bermasalah. Klik untuk cek ulang.'}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200/90 shadow-xs text-[11px] font-medium text-stone-600 active:scale-95 transition"
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status.loading
            ? 'bg-amber-400 animate-pulse'
            : status.ok
            ? 'bg-emerald-500 ring-2 ring-emerald-200'
            : 'bg-rose-500 ring-2 ring-rose-200'
        }`}
      />
      <span className="font-mono text-[10px]">
        {status.loading ? 'Cek...' : status.ok ? 'VPS AI' : 'Offline'}
      </span>
    </button>
  )
}
