import React, { useState, useEffect } from 'react'
import { ChevronLeft, Play, Pause, RotateCcw, Check, Clock, BookOpen, X, Volume2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { patchSubtask } from '../api'

const playChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15) // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.6)
  } catch {
    // Audio autoplay policy fallback
  }
}

export default function TaskDetailModal({ subtask, task, onClose, onComplete }) {
  const WORK_SECONDS = (subtask?.duration_minutes || 25) * 60
  const BREAK_SECONDS = 5 * 60

  const [isBreak, setIsBreak] = useState(false)
  const [timeLeft, setTimeLeft] = useState(WORK_SECONDS)
  const [isActive, setIsActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      playChime()
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
      if (!isBreak) {
        setIsBreak(true)
        setTimeLeft(BREAK_SECONDS)
      } else {
        setIsBreak(false)
        setTimeLeft(WORK_SECONDS)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, isBreak, WORK_SECONDS])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(isBreak ? BREAK_SECONDS : WORK_SECONDS)
  }

  const handleToggleCompleted = async () => {
    if (!subtask?.id) return
    setIsSubmitting(true)
    const nextStatus = !subtask.is_completed
    try {
      await patchSubtask(subtask.id, { is_completed: nextStatus })
      if (nextStatus) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10B981', '#F26A36', '#6366F1', '#F59E0B'],
          })
        } catch (e) {}
      }
      if (onComplete) onComplete({ ...subtask, is_completed: nextStatus })
      onClose()
    } catch (err) {
      console.error('Failed toggling subtask status:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-stone-50 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden shadow-sheet sm:shadow-elevated border border-stone-200">
        
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Top Header Navigation */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 bg-white border-b border-stone-200/80 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 py-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <span className="text-xs font-semibold text-stone-900">
            Langkah {subtask?.step_number || 1}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
          {/* Main Title and Subject */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200 text-stone-800">
                {task?.category?.replace('_', ' ') || 'Tugas'}
              </span>
              {task?.subject && (
                <span className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                  <BookOpen className="w-3 h-3 text-stone-400" />
                  {task.subject}
                </span>
              )}
            </div>

            <h2 className="text-lg font-semibold text-stone-950 leading-snug">
              {subtask?.title}
            </h2>
          </div>

          {/* Action Instruction Box */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-soft space-y-1">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Panduan Pengerjaan
            </span>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              {subtask?.description || 'Fokus pada penyelesaian target langkah ini secara runtut.'}
            </p>
          </div>

          {/* Pomodoro Focus Timer Box */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-tight bg-stone-100 text-stone-700">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-500 animate-pulse' : 'bg-stone-400'}`} />
              <span>{isBreak ? 'Sesi Istirahat (5 Menit)' : isActive ? 'Fokus Berjalan' : 'Timer Fokus'}</span>
            </div>

            <div className="text-5xl font-semibold font-mono tracking-tight text-stone-950 py-1">
              {formatTime(timeLeft)}
            </div>

            <p className="text-[11px] text-stone-400">
              {isBreak ? 'Relaksasi sejenak sebelum sesi berikutnya.' : 'Estimasi: ' + (subtask?.duration_minutes || 25) + ' menit'}
            </p>
          </div>

          {subtask?.target_date && (
            <div className="text-center text-[11px] text-stone-500 font-mono">
              Target Penyelesaian: <span className="font-semibold text-stone-800">{subtask.target_date}</span>
            </div>
          )}
        </div>

        {/* Sticky Action Footer (Proper Mobile Dock, Not Floating Overlay) */}
        <div className="p-4 bg-white border-t border-stone-200/80 flex items-center justify-between gap-3 flex-shrink-0">
          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition active:scale-95 ${
                isActive
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai Fokus</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition active:scale-95"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Done Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleToggleCompleted}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              subtask?.is_completed
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{subtask?.is_completed ? 'Tandai Belum' : 'Selesai'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
