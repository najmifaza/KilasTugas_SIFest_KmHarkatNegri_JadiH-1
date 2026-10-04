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
    <div className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border ${
      status.loading
        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
        : status.ok
        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
        : 'bg-rose-950/60 text-rose-300 border-rose-800/80'
    }`}>
      {status.loading ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      ) : status.ok ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
      )}
      <span className="font-mono">{status.message}</span>
      <button
        onClick={ping}
        className="underline hover:text-white ml-1 opacity-80 hover:opacity-100"
        title="Ping ulang"
      >
        cek
      </button>
    </div>
  )
}
