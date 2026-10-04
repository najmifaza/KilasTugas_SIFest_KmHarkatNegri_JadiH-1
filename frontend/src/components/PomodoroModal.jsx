import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, X, CheckCircle, Flame } from 'lucide-react'

export default function PomodoroModal({ subtask, onClose, onComplete }) {
  const WORK_SECONDS = 25 * 60
  const BREAK_SECONDS = 5 * 60

  const [isBreak, setIsBreak] = useState(false)
  const [timeLeft, setTimeLeft] = useState(WORK_SECONDS)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      // Toggle mode
      if (!isBreak) {
        setIsBreak(true)
        setTimeLeft(BREAK_SECONDS)
      } else {
        setIsBreak(false)
        setTimeLeft(WORK_SECONDS)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, isBreak])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(isBreak ? BREAK_SECONDS : WORK_SECONDS)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-400 font-medium text-xs uppercase tracking-wider mb-2">
          <Flame className="w-4 h-4" /> Focus Mode (Pomodoro)
        </div>

        <h3 className="text-lg font-bold text-zinc-100 line-clamp-1">{subtask?.title}</h3>
        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{subtask?.description}</p>

        {/* Timer Box */}
        <div className="my-8 text-center bg-zinc-950/70 border border-zinc-800/80 rounded-2xl py-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            {isBreak ? '☕ Waktu Istirahat' : '🎯 Sesi Fokus'}
          </div>
          <div className="text-6xl font-black font-mono tracking-tight text-white">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg shadow-indigo-600/30"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            {isActive ? 'Jeda' : 'Mulai'}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              onComplete(subtask)
              onClose()
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Tandai Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
