import React, { useState, useEffect } from 'react'
import { Sparkles, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { checkHealth } from '../api'

export default function AppHeader() {
  const [status, setStatus] = useState({ loading: true, ok: false })

  const runCheck = async () => {
    setStatus((prev) => ({ ...prev, loading: true }))
    try {
      const res = await checkHealth()
      if (res && res.status === 'ok') {
        setStatus({ loading: false, ok: true })
      } else {
        setStatus({ loading: false, ok: false })
      }
    } catch (e) {
      setStatus({ loading: false, ok: false })
    }
  }

  useEffect(() => {
    runCheck()
    const timer = setInterval(runCheck, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* User Identity / Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs border border-violet-400/30 shrink-0">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-black text-slate-900 tracking-tight leading-none truncate">
              Halo, Mahasiswa! 👋
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 leading-none mt-1 truncate">
              KilasTugas • SIFest 2026
            </p>
          </div>
        </div>

        {/* Live Backend AI Pill Badge (Identical to BEM-U status badge) */}
        <button
          type="button"
          onClick={runCheck}
          title="Klik untuk cek status VPS & AI"
          className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-bold shadow-2xs flex items-center gap-1.5 transition active:scale-95 ${
            status.loading
              ? 'border-slate-200 bg-slate-50 text-slate-500'
              : status.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status.loading
                ? 'bg-slate-400 animate-ping'
                : status.ok
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span>{status.loading ? 'Checking...' : status.ok ? 'AI VPS Online' : 'Offline'}</span>
        </button>
      </div>
    </header>
  )
}
