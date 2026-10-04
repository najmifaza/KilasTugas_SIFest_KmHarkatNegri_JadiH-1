import React, { useEffect, useState } from 'react'
import { checkHealth } from '../api'
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

export default function HealthBanner() {
  const [status, setStatus] = useState({ loading: true, ok: false, message: '' })

  const ping = async () => {
    setStatus({ loading: true, ok: false, message: 'Checking backend...' })
    try {
      const data = await checkHealth()
      setStatus({ loading: false, ok: true, message: data.app || 'Backend Online' })
    } catch (err) {
      setStatus({
        loading: false,
        ok: false,
        message: 'Backend Offline / Tunnel Reconnecting (' + (err.message || 'error') + ')',
      })
    }
  }

  useEffect(() => {
    ping()
    const timer = setInterval(ping, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 border font-mono ${
      status.loading
        ? 'bg-stone-100 text-stone-600 border-stone-200'
        : status.ok
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
        : 'bg-rose-50 text-rose-800 border-rose-200'
    }`}>
      {status.loading ? (
        <RefreshCw className="w-3 h-3 animate-spin text-stone-500" />
      ) : status.ok ? (
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
      ) : (
        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
      )}
      <span className="text-[11px] font-medium">{status.ok ? 'API Connected' : status.message}</span>
      <button
        onClick={ping}
        className="text-[11px] text-stone-500 hover:text-stone-900 underline ml-0.5"
        title="Ping ulang"
      >
        cek
      </button>
    </div>
  )
}
