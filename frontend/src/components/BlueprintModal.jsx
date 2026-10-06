import React, { useState, useEffect, useRef } from 'react'
import { Check, Download, BookOpen, Clock, AlertCircle, X, Layers } from 'lucide-react'
import confetti from 'canvas-confetti'
import { cloneBlueprint, getSessionId } from '../api'

const CATEGORY_MAP = {
  laporan_lab: 'Laporan Lab',
  makalah: 'Makalah Teori',
  coding: 'Projek Coding',
  presentasi: 'Presentasi',
  custom: 'Tugas Kuliah',
}

export default function BlueprintModal({ blueprint, onClose, onImportSuccess }) {
  const [isMounted, setIsMounted] = useState(Boolean(blueprint))
  const [isVisible, setIsVisible] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartY = useRef(0)
  const isDraggingRef = useRef(false)
  const currentDragY = useRef(0)

  // Keep reference to blueprint so exit animation renders content smoothly
  const activeBlueprintRef = useRef(blueprint)
  if (blueprint) activeBlueprintRef.current = blueprint
  const currentBlueprint = blueprint || activeBlueprintRef.current

  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')

  // Calculate default deadline: 4 days from today
  const defaultDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 4)
    return d.toISOString().split('T')[0]
  }
  const [deadlineDate, setDeadlineDate] = useState(defaultDate())

  // Lifecycle animation
  useEffect(() => {
    if (blueprint) {
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
  }, [blueprint])

  const handleAnimatedClose = () => {
    if (importing) return
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      setDragY(0)
      currentDragY.current = 0
    }, 280)
  }

  // Pointer / Drag down gestures
  const onPointerDown = (e) => {
    if (importing) return
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

  if (!isMounted || !currentBlueprint) return null

  const totalMinutes = (currentBlueprint.subtasks || []).reduce(
    (acc, curr) => acc + (Number(curr.duration_minutes) || 25),
    0
  )

  const handleImport = async () => {
    setImporting(true)
    setError('')
    try {
      const sid = getSessionId()
      const deadlineISO = new Date(`${deadlineDate}T23:59:00`).toISOString()
      const res = await cloneBlueprint(currentBlueprint.id, sid, deadlineISO)

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#18181B', '#C7F263', '#10B981', '#F59E0B'],
        })
      } catch (e) {}

      if (onImportSuccess) {
        onImportSuccess(res.task_id)
      }
      handleAnimatedClose()
    } catch (err) {
      console.error('Import error:', err)
      setError(err?.response?.data?.detail || 'Gagal mengimpor cetak biru tugas. Silakan coba lagi.')
    } finally {
      setImporting(false)
    }
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
        if (e.target === e.currentTarget && !importing) handleAnimatedClose()
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
        {/* Mobile handle indicator with touch drag target */}
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
          {/* Close Button (White circle) */}
          <button
            type="button"
            onClick={handleAnimatedClose}
            disabled={importing}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xs text-zinc-800 hover:bg-slate-50 transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Centered Title Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-zinc-800 border border-slate-200/80 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-zinc-700" />
            <span>Cetak Biru Tugas</span>
          </div>

          {/* Spacer to balance title */}
          <div className="w-11 sm:w-12 h-1" />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 pt-2 space-y-3.5 no-scrollbar">
          {/* Title & Subject Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                {CATEGORY_MAP[currentBlueprint.category] || 'Tugas Kuliah'}
              </span>
              {currentBlueprint.subject && (
                <span className="flex items-center gap-1 text-xs text-zinc-600 font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  {currentBlueprint.subject}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight leading-snug">
              {currentBlueprint.title}
            </h2>
            {currentBlueprint.description && (
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                {currentBlueprint.description}
              </p>
            )}
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-100 text-center shadow-xs">
            <div>
              <span className="block text-[11px] font-semibold text-zinc-500">
                Jumlah Langkah
              </span>
              <span className="text-base font-bold text-zinc-900">
                {currentBlueprint.subtasks?.length || 0} Langkah Kerja
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-zinc-500">
                Total Waktu Fokus
              </span>
              <span className="text-base font-bold text-zinc-900 font-mono">
                ~{totalMinutes} Menit
              </span>
            </div>
          </div>

          {/* Subtasks Preview List */}
          <div>
            <span className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Rincian Micro-Pacing:
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(currentBlueprint.subtasks || []).map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="p-3 bg-white border border-slate-100 rounded-2xl flex items-start gap-2.5 text-left shadow-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-800 leading-tight">
                      {sub.title}
                    </p>
                    {sub.description && (
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                        {sub.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-zinc-600 shrink-0 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/50">
                    {sub.duration_minutes || 25}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Set Target Deadline */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Target Tenggat Waktu Anda:
            </label>
            <input
              type="date"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-900"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="pt-3 pb-1 shrink-0 border-t border-zinc-200/40">
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="w-full h-14 bg-zinc-950 hover:bg-black text-white rounded-full text-base font-semibold shadow-xl flex items-center justify-center gap-2 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
          >
            {importing ? (
              <span>Menyalin ke Jadwal Anda...</span>
            ) : (
              <>
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>Impor ke Jadwalku</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
