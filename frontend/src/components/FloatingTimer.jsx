import React from 'react'
import { Play, Pause, Maximize2, X, Coffee } from 'lucide-react'

export default function FloatingTimer({
  timerState,
  onToggle,
  onOpenModal,
  onCloseTimer,
}) {
  if (!timerState || !timerState.subtask) return null

  const { isActive, isBreak, remainingSeconds, subtask, task } = timerState

  const mins = Math.floor(remainingSeconds / 60)
  const secs = remainingSeconds % 60
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return (
    <aside
      aria-label="Timer Fokus Berjalan"
      className="fixed bottom-6 left-4 right-20 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-auto sm:min-w-[360px] sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="bg-[#18181B]/95 backdrop-blur-md text-white rounded-full px-4 py-2.5 shadow-2xl border border-white/20 flex items-center justify-between gap-3">
        {/* Clickable Info Area to reopen detail modal */}
        <div
          onClick={onOpenModal}
          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none group"
          title="Klik untuk membuka layar fokus penuh"
        >
          {/* Status Indicator */}
          <div className="relative flex items-center justify-center shrink-0">
            {isBreak ? (
              <Coffee className="w-4 h-4 text-emerald-400" />
            ) : (
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isActive ? 'bg-amber-400 animate-pulse ring-4 ring-amber-400/20' : 'bg-zinc-500'
                }`}
              />
            )}
          </div>

          {/* Time Display */}
          <span className="font-mono font-bold text-sm tracking-tight text-white shrink-0">
            {formattedTime}
          </span>

          {/* Vertical Separator */}
          <span className="w-px h-3.5 bg-white/20 shrink-0" aria-hidden="true" />

          {/* Subtask Title & Task Subject */}
          <div className="min-w-0 flex-1 truncate">
            <span className="text-xs font-medium text-zinc-200 truncate block group-hover:text-white transition">
              {subtask.title}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Play / Pause Button */}
          <button
            type="button"
            onClick={onToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold'
            }`}
            title={isActive ? 'Jeda Timer' : 'Lanjutkan Timer'}
            aria-label={isActive ? 'Jeda Timer' : 'Lanjutkan Timer'}
          >
            {isActive ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Expand Fullscreen / Modal Button */}
          <button
            type="button"
            onClick={onOpenModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Buka Layar Fokus Penuh"
            aria-label="Buka Layar Fokus Penuh"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Close/Discard Timer Button */}
          <button
            type="button"
            onClick={onCloseTimer}
            className="w-8 h-8 rounded-full bg-transparent hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Hentikan & Tutup Timer"
            aria-label="Hentikan & Tutup Timer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
