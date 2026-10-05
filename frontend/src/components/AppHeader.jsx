import React, { useState, useEffect } from 'react'
import { Plus, Bell } from 'lucide-react'
import { checkHealth } from '../api'

export default function AppHeader({ onOpenCreate }) {
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
    } catch {
      setStatus({ loading: false, ok: false })
    }
  }

  useEffect(() => {
    runCheck()
    const timer = setInterval(runCheck, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full pt-4 sm:pt-6 pb-2 min-w-0">
      {/* Top Utility Bar: Avatar + Greeting + Quick Actions */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* User Identity / Avatar with KilasTugas 3D Brand Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 shrink-0 overflow-hidden p-1 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="KilasTugas"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <span className="text-base font-semibold text-[#1C1C1E] leading-tight block truncate">
              KilasTugas
            </span>
            <span className="text-[12px] font-medium text-[#71717A] leading-tight block truncate">
              Micro-Pacing Perencana
            </span>
          </div>
        </div>

        {/* Right Actions: Black Plus Button & White Bell Button (44px x 44px) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Black Plus Button */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="w-11 h-11 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Tambah Tugas Baru"
            aria-label="Tambah tugas baru"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* White Bell / Connection Status Button */}
          <button
            type="button"
            onClick={runCheck}
            title={status.ok ? 'Server tersambung' : 'Server terputus, klik untuk cek'}
            className="w-11 h-11 rounded-full bg-white text-[#1C1C1E] flex items-center justify-center shadow-sm border border-black/5 hover:scale-105 active:scale-95 transition cursor-pointer relative"
            aria-label="Status koneksi dan notifikasi"
          >
            <Bell className="w-5 h-5 text-[#1C1C1E]" strokeWidth={2} />
            <span
              className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${
                status.loading
                  ? 'bg-amber-400 animate-pulse'
                  : status.ok
                  ? 'bg-[#C7F263] ring-1 ring-black/10'
                  : 'bg-rose-500 ring-1 ring-black/10'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Hero Display Headline (Two-line font-medium 32px) */}
      <div className="pt-2 pb-1">
        <h1
          className="text-[32px] sm:text-[34px] text-[#18181B] leading-[1.18] tracking-tight"
          style={{ fontWeight: 500 }}
        >
          Yuk, Bikin<br />Hari Ini Produktif
        </h1>
      </div>
    </div>
  )
}
