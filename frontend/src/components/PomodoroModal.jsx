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
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-stone-500 font-medium text-xs uppercase tracking-wider mb-2">
          <span>Mode Fokus Mandiri</span>
        </div>

        <h3 className="text-base font-semibold text-stone-900 line-clamp-1">{subtask?.title}</h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{subtask?.description}</p>

        {/* Timer Box */}
        <div className="my-6 text-center bg-stone-50 border border-stone-200 rounded-xl py-7">
          <div className="text-[11px] font-medium uppercase tracking-widest text-stone-500 mb-1">
            {isBreak ? 'Waktu Istirahat' : 'Sesi Fokus Terarah'}
          </div>
          <div className="text-5xl font-bold font-mono tracking-tight text-stone-900">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition shadow-xs"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            {isActive ? 'Jeda' : 'Mulai'}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onComplete(subtask)
              onClose()
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition text-xs font-medium"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Tandai Selesai
          </button>
        </div>
      </div>
    </div>
  )
}
