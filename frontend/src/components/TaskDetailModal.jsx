import React, { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  BookOpen,
  X,
  Edit3,
  Save,
  Calendar,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { patchSubtask } from '../api'

const playCheckSound = (isCompleted = true) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    if (isCompleted) {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.45)
    } else {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.18)
    }
  } catch (e) {}
}

export default function TaskDetailModal({
  subtask,
  task,
  onClose,
  onComplete,
  timerState,
  onStartTimer,
  onToggleTimer,
  onResetTimer,
}) {
  const [isMounted, setIsMounted] = useState(Boolean(subtask))
  const [isVisible, setIsVisible] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartY = useRef(0)
  const isDraggingRef = useRef(false)
  const currentDragY = useRef(0)

  // Keep references to subtask and task so exit animation renders content smoothly
  const activeSubtaskRef = useRef(subtask)
  const activeTaskRef = useRef(task)

  if (subtask) activeSubtaskRef.current = subtask
  if (task) activeTaskRef.current = task

  const currentSubtask = subtask || activeSubtaskRef.current
  const currentTask = task || activeTaskRef.current

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(currentSubtask?.title || '')
  const [editDesc, setEditDesc] = useState(currentSubtask?.description || '')
  const [editDuration, setEditDuration] = useState(currentSubtask?.duration_minutes || 25)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Enter and exit animation lifecycle
  useEffect(() => {
    if (subtask) {
      setIsMounted(true)
      setDragY(0)
      currentDragY.current = 0
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 20)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setIsMounted(false)
      setDragY(0)
      currentDragY.current = 0
    }
  }, [subtask])

  // Reset local edit states if subtask changes
  useEffect(() => {
    if (subtask) {
      setEditTitle(subtask.title || '')
      setEditDesc(subtask.description || '')
      setEditDuration(subtask.duration_minutes || 25)
      setIsEditing(false)
    }
  }, [subtask?.id])

  const handleAnimatedClose = () => {
    if (isSubmitting) return
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      setDragY(0)
      currentDragY.current = 0
    }, 280)
  }

  // Pointer / Drag down gestures
  const onPointerDown = (e) => {
    if (isSubmitting) return
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (err) {}
    const y = e.clientY || 0
    dragStartY.current = y
    isDraggingRef.current = true
    setIsDragging(true)
  }

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return
    const y = e.clientY || 0
    const dy = y - dragStartY.current
    if (dy > 0) {
      currentDragY.current = dy
      setDragY(dy)
    } else {
      currentDragY.current = 0
      setDragY(0)
    }
  }

  const onPointerUp = (e) => {
    if (!isDraggingRef.current) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {}
    const finalDy = currentDragY.current
    isDraggingRef.current = false
    setIsDragging(false)
    if (finalDy > 75) {
      handleAnimatedClose()
    } else {
      setDragY(0)
      currentDragY.current = 0
    }
  }

  if (!isMounted || !currentSubtask) return null

  const isCurrentTimer = timerState?.subtask?.id === currentSubtask.id
  const currentDuration = Number(currentSubtask?.duration_minutes) || 25
  const isTimerActive = isCurrentTimer ? Boolean(timerState?.isActive) : false
  const isTimerBreak = isCurrentTimer ? Boolean(timerState?.isBreak) : false
  const displaySeconds = isCurrentTimer
    ? timerState.remainingSeconds
    : currentDuration * 60

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleTimerAction = () => {
    if (isCurrentTimer) {
      if (onToggleTimer) onToggleTimer()
    } else {
      if (onStartTimer) onStartTimer(currentSubtask, currentTask, currentDuration)
    }
  }

  const handleResetAction = () => {
    if (isCurrentTimer && onResetTimer) {
      onResetTimer()
    }
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editTitle.trim()) return
    setIsSubmitting(true)
    try {
      await patchSubtask(currentSubtask.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        duration_minutes: Number(editDuration) || 25,
      })
      const updated = {
        ...currentSubtask,
        title: editTitle.trim(),
        description: editDesc.trim(),
        duration_minutes: Number(editDuration) || 25,
      }
      if (onComplete) onComplete(updated)
      setIsEditing(false)
    } catch (err) {
      alert('Gagal menyimpan perubahan langkah kerja')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleCompleted = async () => {
    if (!currentSubtask?.id) return
    setIsSubmitting(true)
    const nextStatus = !currentSubtask.is_completed

    // Instant audio feedback
    playCheckSound(nextStatus)
    if (nextStatus) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#18181B', '#C7F263', '#10B981', '#F59E0B'],
        })
      } catch (e) {}
    }

    try {
      await patchSubtask(currentSubtask.id, { is_completed: nextStatus })
      if (onComplete) onComplete({ ...currentSubtask, is_completed: nextStatus })
      handleAnimatedClose()
    } catch (err) {
      console.error('Failed toggling subtask status:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openSubtaskInGoogleCalendar = () => {
    const pad = (n) => String(n).padStart(2, '0')
    const toUTC = (d) => {
      return (
        d.getUTCFullYear() +
        pad(d.getUTCMonth() + 1) +
        pad(d.getUTCDate()) +
        'T' +
        pad(d.getUTCHours()) +
        pad(d.getUTCMinutes()) +
        pad(d.getUTCSeconds()) +
        'Z'
      )
    }

    let start = new Date()
    if (currentSubtask?.target_date) {
      const parts = currentSubtask.target_date.split('-')
      if (parts.length === 3) {
        start = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 9, 0, 0)
      }
    } else {
      start.setHours(9, 0, 0, 0)
    }

    const duration = (currentSubtask?.duration_minutes || 25) * 60 * 1000
    const end = new Date(start.getTime() + duration)

    const title = `[KilasTugas] ${currentTask?.subject ? currentTask.subject + ': ' : ''}${currentSubtask.title}`
    const details = `Langkah ${currentSubtask.step_number || 1} dari tugas: ${currentTask?.title || ''}\n\nPanduan Pengerjaan:\n${currentSubtask.description || '-'}\n\nEstimasi: ${currentSubtask.duration_minutes || 25} menit Pomodoro.\nKilasTugas: https://kilastugas.vercel.app`

    const params = new URLSearchParams()
    params.set('action', 'TEMPLATE')
    params.set('text', title)
    params.set('dates', `${toUTC(start)}/${toUTC(end)}`)
    params.set('details', details)
    params.set('location', 'KilasTugas')

    const url = `https://calendar.google.com/calendar/render?${params.toString()}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const backdropOpacity = isVisible
    ? Math.max(0.1, 1 - (dragY / 380))
    : 0

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300"
      style={{
        opacity: backdropOpacity,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) handleAnimatedClose()
      }}
    >
      <div
        style={{
          transform: isDragging
            ? `translateY(${Math.max(0, dragY)}px)`
            : isVisible
            ? 'translateY(0)'
            : 'translateY(100%)',
          transition: isDragging
            ? 'none'
            : 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-[#F7F4EF] p-5 sm:p-6 shadow-2xl border border-white/80 max-h-[94vh] flex flex-col font-sans text-zinc-900 will-change-transform"
      >
        {/* Mobile handle indicator */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="w-full py-2.5 -mt-2 cursor-grab active:cursor-grabbing flex items-center justify-center shrink-0 touch-none select-none"
          title="Tarik ke bawah untuk menutup"
        >
          <div className="w-12 h-1.5 bg-zinc-300 hover:bg-zinc-400 rounded-full transition-colors" />
        </div>

        {/* Header: White Circular Buttons + Centered Title */}
        <header
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex items-center justify-between pb-3 shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
        >
          {/* Back Button (White circle) */}
          <button
            type="button"
            onClick={handleAnimatedClose}
            disabled={isSubmitting}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xs text-zinc-800 hover:bg-slate-50 transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Centered Step Title */}
          <div className="text-center min-w-0 px-2 flex-1">
            <h2 className="text-[17px] font-bold text-zinc-900 tracking-tight truncate">
              Langkah {currentSubtask?.step_number || 1}
            </h2>
            {currentTask?.subject && (
              <span className="text-[11px] font-semibold text-zinc-500 block truncate">
                {currentTask.subject}
              </span>
            )}
          </div>

          {/* Edit Toggle Button */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xs text-zinc-800 hover:bg-slate-50 transition active:scale-95 cursor-pointer shrink-0"
            aria-label={isEditing ? 'Batal edit' : 'Edit langkah'}
            title={isEditing ? 'Batal edit' : 'Edit langkah'}
          >
            {isEditing ? (
              <X className="w-5 h-5 stroke-[2]" />
            ) : (
              <Edit3 className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 pt-2 space-y-3.5 no-scrollbar">
          {isEditing ? (
            /* Edit Form View */
            <form onSubmit={handleSaveEdit} className="space-y-3.5 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Ubah Rincian Langkah
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Judul Langkah
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-11 bg-slate-50 rounded-xl px-3 text-sm font-semibold text-zinc-900 border border-slate-200 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Estimasi Durasi
                </label>
                <select
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                  className="w-full h-11 bg-slate-50 rounded-xl px-3 text-sm font-semibold text-zinc-900 border border-slate-200 focus:outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value={15}>15 Menit</option>
                  <option value={25}>25 Menit (Standar Pomodoro)</option>
                  <option value={35}>35 Menit</option>
                  <option value={45}>45 Menit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Instruksi / Panduan Pengerjaan
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl p-3 text-sm font-medium text-zinc-900 border border-slate-200 focus:outline-none focus:border-zinc-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Main Step Title & Category */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-zinc-700">
                    {currentTask?.category?.replace('_', ' ') || 'Tugas Kuliah'}
                  </span>
                  {currentTask?.title && (
                    <span className="text-xs text-zinc-500 font-medium truncate">
                      • {currentTask.title}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                  {currentSubtask?.title}
                </h3>
              </div>

              {/* Action Instruction Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Panduan Pengerjaan
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium mt-1">
                    {currentSubtask?.description || 'Fokus pada penyelesaian target langkah ini secara runtut.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openSubtaskInGoogleCalendar}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-zinc-700" />
                  <span>Jadwalkan Langkah di Google Calendar</span>
                </button>
              </div>

              {/* Pomodoro Focus Timer Box */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight bg-slate-100 text-zinc-700">
                  <span className={`w-2 h-2 rounded-full ${isTimerActive ? 'bg-amber-500 animate-pulse' : 'bg-zinc-400'}`} />
                  <span>
                    {isTimerBreak
                      ? 'Sesi Istirahat (5 Menit)'
                      : isTimerActive
                      ? 'Fokus Berjalan'
                      : 'Timer Fokus Pomodoro'}
                  </span>
                </div>

                <div className="text-5xl font-black font-mono tracking-tight text-zinc-950 py-1 select-none">
                  {formatTime(displaySeconds)}
                </div>

                <p className="text-[11px] text-zinc-500 font-medium">
                  {isTimerBreak
                    ? 'Relaksasi sejenak sebelum sesi berikutnya.'
                    : `Estimasi: ${currentDuration} menit fokus`}
                </p>

                {/* Inline Timer Controls */}
                <div className="flex items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleTimerAction}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition active:scale-95 cursor-pointer ${
                      isTimerActive
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                        : 'bg-zinc-900 hover:bg-black text-white shadow-xs'
                    }`}
                  >
                    {isTimerActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Jeda Timer</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        <span>
                          {isCurrentTimer && displaySeconds < currentDuration * 60
                            ? 'Lanjutkan Fokus'
                            : 'Mulai Fokus'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAction}
                    disabled={!isCurrentTimer}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-35 text-zinc-600 flex items-center justify-center transition active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                    title="Reset Timer"
                    aria-label="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {currentSubtask?.target_date && (
                <div className="text-center text-[11px] text-zinc-500 font-mono">
                  Target Penyelesaian:{' '}
                  <span className="font-bold text-zinc-800">{currentSubtask.target_date}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom CTA (Fixed at base) */}
        <div className="pt-3 pb-1 shrink-0 border-t border-zinc-200/40">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleToggleCompleted}
            className={`w-full h-14 rounded-full text-base font-semibold shadow-xl flex items-center justify-center gap-2 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 ${
              currentSubtask?.is_completed
                ? 'bg-white border border-slate-200 text-zinc-800 hover:bg-slate-50'
                : 'bg-zinc-950 hover:bg-black text-white'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>
              {currentSubtask?.is_completed
                ? 'Tandai Belum Selesai'
                : 'Selesaikan Langkah Ini'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
