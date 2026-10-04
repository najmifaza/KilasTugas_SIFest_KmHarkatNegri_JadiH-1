import React, { useEffect, useState } from 'react'
import { checkHealth } from '../api'

export default function HealthBanner() {
  const [status, setStatus] = useState({ loading: true, ok: false })

  const ping = async () => {
    try {
      await checkHealth()
      setStatus({ loading: false, ok: true })
    } catch {
      setStatus({ loading: false, ok: false })
    }
  }

  useEffect(() => {
    ping()
    const timer = setInterval(ping, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <button
      type="button"
      onClick={ping}
      title={status.ok ? 'Server tersambung dan siap' : 'Gagal menghubungi server. Klik untuk cek ulang.'}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium transition active:scale-95 ${
        status.ok
          ? 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status.loading
            ? 'bg-amber-400 animate-pulse'
            : status.ok
            ? 'bg-emerald-500'
            : 'bg-rose-500'
        }`}
      />
      <span className="text-[10px] tracking-tight">
        {status.loading ? 'Menghubungkan' : status.ok ? 'Tersambung' : 'Offline'}
      </span>
    </button>
  )
}
