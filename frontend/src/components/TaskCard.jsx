import React, { useState, useEffect } from 'react'
import {
  Check,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
  Plus,
  Calendar,
  MoreHorizontal,
  Download,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { getSubtasks, patchSubtask, createSubtask, deleteSubtask } from '../api'

const CATEGORY_MAP = {
  laporan_lab: 'Laporan Lab',
  makalah: 'Makalah Teori',
  coding: 'Projek Coding',
  presentasi: 'Presentasi',
  custom: 'Tugas Kuliah',
}

export default function TaskCard({ task, onOpenDetail, onDeleteTask }) {
  const [subtasks, setSubtasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const fetchSubtasks = async () => {
    setLoading(true)
    try {
      const res = await getSubtasks(task.id)
      setSubtasks(res.data || [])
    } catch (err) {
      console.error('Failed fetching subtasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubtasks()
  }, [task.id])

  const fireConfetti = (e) => {
    if (e) e.stopPropagation()
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#7C3AED', '#6366F1', '#10B981', '#F59E0B'],
      })
    } catch (err) {
      // ignore
    }
  }

  const [isAdding, setIsAdding] = useState(false)
  const [newStepTitle, setNewStepTitle] = useState('')
  const [newStepDuration, setNewStepDuration] = useState(25)

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (!newStepTitle.trim()) return
    try {
      const res = await createSubtask(task.id, {
        title: newStepTitle.trim(),
        duration_minutes: Number(newStepDuration) || 25,
      })
      if (res.data) {
        setSubtasks((prev) => [...prev, res.data])
      }
      setNewStepTitle('')
      setIsAdding(false)
    } catch (err) {
      alert('Gagal menambah langkah kerja')
    }
  }

  const handleDeleteSubtask = async (e, subtaskId) => {
    e.stopPropagation()
    if (!window.confirm('Hapus langkah kerja ini?')) return
    try {
      await deleteSubtask(subtaskId)
      setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId))
    } catch (err) {
      alert('Gagal menghapus langkah kerja')
    }
  }

  const exportToCalendar = (e) => {
    if (e) e.stopPropagation()
    if (!subtasks || subtasks.length === 0) {
      alert('Belum ada langkah kerja untuk diekspor.')
      return
    }

    const pad = (n) => String(n).padStart(2, '0')
    const formatICSDate = (date) => {
      return (
        date.getUTCFullYear() +
        pad(date.getUTCMonth() + 1) +
        pad(date.getUTCDate()) +
        'T' +
        pad(date.getUTCHours()) +
        pad(date.getUTCMinutes()) +
        pad(date.getUTCSeconds()) +
        'Z'
      )
    }

    const now = new Date()
    const nowStr = formatICSDate(now)

    let events = []

    subtasks.forEach((st, idx) => {
      let startDate = new Date()
      if (st.target_date) {
        const parts = st.target_date.split('-')
        if (parts.length === 3) {
          startDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 9 + (idx % 8), 0, 0)
        }
      } else {
        startDate.setDate(startDate.getDate() + Math.min(idx, 7))
        startDate.setHours(9 + (idx % 8), 0, 0, 0)
      }

      const durationMinutes = st.duration_minutes || 25
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

      const uid = `kt-${task.id}-${st.id || idx}@najmifaza.my.id`
      const summary = `[KilasTugas] ${task.subject ? task.subject + ' - ' : ''}${st.title}`
      const description = `Langkah ${st.step_number || idx + 1}: ${st.description || st.title}\n\nTugas: ${task.title}\nEstimasi: ${durationMinutes} menit.\nStatus: ${st.is_completed ? 'Selesai' : 'Belum Selesai'}`

      events.push([
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${nowStr}`,
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:${summary.replace(/,/g, '\\,')}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Pengingat Fokus KilasTugas',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n'))
    })

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KilasTugas//SIFest 2026//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:KilasTugas - ' + task.title,
      events.join('\r\n'),
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${task.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_jadwal.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const openGoogleCalendar = (e) => {
    if (e) e.stopPropagation()
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

    const dDate = new Date(task.deadline)
    const startDate = new Date(dDate.getTime() - 2 * 60 * 60 * 1000)
    const startStr = toUTC(startDate)
    const endStr = toUTC(dDate)

    const title = `[KilasTugas] ${task.subject ? task.subject + ': ' : ''}${task.title}`
    const stepsSummary = subtasks.length > 0
      ? subtasks.map((s, i) => `${i + 1}. ${s.title} (${s.duration_minutes || 25}m)`).join('\n')
      : 'Target selesai tepat waktu.'

    const details = `Target Tugas: ${task.title}\nMata Kuliah: ${task.subject || '-'}\nTenggat Waktu: ${dDate.toLocaleString('id-ID')}\n\nRincian Langkah Micro-Pacing KilasTugas:\n${stepsSummary}\n\nKelola Tugas: https://kilastugas.vercel.app`

    const params = new URLSearchParams()
    params.set('action', 'TEMPLATE')
    params.set('text', title)
    params.set('dates', `${startStr}/${endStr}`)
    params.set('details', details)
    params.set('location', 'KilasTugas • SIFest 2026')

    const gcalUrl = `https://calendar.google.com/calendar/render?${params.toString()}`
    window.open(gcalUrl, '_blank', 'noopener,noreferrer')
  }

  const toggleSubtask = async (e, st) => {
    e.stopPropagation()
    const nextState = !st.is_completed

    // Optimistic UI update
    const updated = subtasks.map((s) => (s.id === st.id ? { ...s, is_completed: nextState } : s))
    setSubtasks(updated)

    const newlyCompleted = updated.filter((s) => s.is_completed).length
    if (newlyCompleted === total && total > 0 && nextState) {
      fireConfetti()
    }

    if (navigator.vibrate) {
      navigator.vibrate(25)
    }

    try {
      await patchSubtask(st.id, { is_completed: nextState })
    } catch (err) {
      // Rollback on network failure
      setSubtasks((prev) =>
        prev.map((s) => (s.id === st.id ? { ...s, is_completed: st.is_completed } : s))
      )
    }
  }

  const total = subtasks.length
  const completed = subtasks.filter((s) => s.is_completed).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const isAllDone = total > 0 && completed === total

  const deadlineDate = new Date(task.deadline)
  const now = new Date()
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))
  const isOverdue = diffDays < 0 && !isAllDone

  let pacing = { label: 'On Track 🟢', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200' }
  if (isAllDone) {
    pacing = { label: 'Siap Kumpul 🎉', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold' }
  } else if (isOverdue) {
    pacing = { label: 'Overdue Alert 🔴', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-bold' }
  } else if (diffDays <= 1 && percent < 60) {
    pacing = { label: 'Behind Schedule 🟡', color: 'text-amber-800 bg-amber-50 border border-amber-200' }
  }

  // Hide duplicated subject if it's identical to title
  const hasDistinctSubject =
    task.subject &&
    task.subject.trim().toLowerCase() !== task.title.trim().toLowerCase()

  return (
    <article className="bg-white rounded-[1.5rem] border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Card Header */}
      <div className="p-4 sm:p-5 pb-3.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Subtle Category & Pacing Status */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {CATEGORY_MAP[task.category] || 'Tugas'}
            </span>
            <span className="text-slate-300">•</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pacing.color}`}>
              {pacing.label}
            </span>
          </div>

          {/* Minimal Actions Menu & Expand */}
          <div className="flex items-center gap-1">
            {/* Options Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition active:scale-90"
                title="Opsi Tugas"
                aria-label="Opsi tugas"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(false)
                    }}
                  />
                  <div className="absolute right-0 top-9 z-40 bg-white rounded-2xl shadow-elevated border border-slate-200/90 py-1.5 w-52 text-xs font-semibold text-slate-700 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={(e) => {
                        setShowMenu(false)
                        openGoogleCalendar(e)
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-800"
                    >
                      <Calendar className="w-4 h-4 text-violet-600 shrink-0" />
                      <span>Buka di Google Calendar</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        setShowMenu(false)
                        exportToCalendar(e)
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-800"
                    >
                      <Download className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Unduh Berkas .ics</span>
                    </button>

                    {onDeleteTask && (
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            setShowMenu(false)
                            onDeleteTask(task.id)
                          }}
                          className="w-full px-3.5 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Hapus Tugas</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Expand / Collapse Chevron */}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition active:scale-90"
              aria-label={expanded ? 'Tutup rincian' : 'Buka rincian'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h3 className="font-black text-slate-900 text-lg leading-snug tracking-tight">
          {task.title}
        </h3>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          {hasDistinctSubject && (
            <>
              <span className="font-semibold text-slate-700">{task.subject}</span>
              <span className="text-slate-300">•</span>
            </>
          )}
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {isAllDone
                ? 'Target tuntas'
                : diffDays > 0
                ? `${diffDays} hari lagi`
                : diffDays === 0
                ? 'Hari ini'
                : `${Math.abs(diffDays)} hari lewat`}
            </span>
          </span>
        </div>

        {/* Sleek Progress Bar Section */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Progres Langkah
            </span>
            <div className="flex items-center gap-2">
              {isAllDone && (
                <button
                  type="button"
                  onClick={fireConfetti}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 active:scale-95 transition"
                >
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Rayakan</span>
                </button>
              )}
              <span className="font-mono text-slate-700 font-bold text-xs">
                {completed}/{total} ({percent}%)
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllDone
                  ? 'bg-emerald-500'
                  : 'bg-violet-600'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subtask List */}
      {expanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1 space-y-1.5 border-t border-slate-100 bg-slate-50/50">
          {loading && subtasks.length === 0 ? (
            <div className="text-xs text-slate-400 py-4 text-center font-medium">
              Memuat langkah kerja...
            </div>
          ) : subtasks.length === 0 ? (
            <div className="text-xs text-slate-400 py-4 text-center font-medium">
              Belum ada langkah kerja terurai.
            </div>
          ) : (
            subtasks.map((st, idx) => {
              const stepNum = st.step_number || (idx + 1)
              return (
                <div
                  key={st.id || idx}
                  onClick={() => onOpenDetail(st, task)}
                  className={`group flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                    st.is_completed
                      ? 'bg-slate-100/70 border-slate-200/60 opacity-60'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs'
                  }`}
                >
                  {/* Big accessible Touch Area for Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => toggleSubtask(e, st)}
                    className="w-9 h-9 -my-1 -ml-1 flex items-center justify-center rounded-xl text-slate-400 hover:text-violet-600 active:scale-90 transition flex-shrink-0"
                    aria-label={`Tandai ${st.title} ${st.is_completed ? 'belum selesai' : 'selesai'}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                        st.is_completed
                          ? 'bg-violet-600 border-violet-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-violet-400'
                      }`}
                    >
                      {st.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>

                  {/* Step Order Badge */}
                  <span className="font-mono text-[10px] font-bold text-slate-400 px-0.5">
                    {String(stepNum).padStart(2, '0')}
                  </span>

                  {/* Title and metadata */}
                  <div className="flex-1 min-w-0 pr-1">
                    <p
                      className={`text-xs font-semibold leading-snug line-clamp-1 ${
                        st.is_completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {st.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                      <span>{st.duration_minutes || 25}m</span>
                      {st.target_date && <span>• {st.target_date}</span>}
                    </div>
                  </div>

                  {/* Delete subtask button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSubtask(e, st.id)}
                    className="w-7 h-7 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition opacity-60 hover:opacity-100 flex-shrink-0"
                    title="Hapus langkah ini"
                    aria-label="Hapus langkah"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Action chevron */}
                  <div className="w-5 h-5 flex items-center justify-center text-slate-300 group-hover:text-violet-600 transition flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )
            })
          )}

          {/* Add Subtask Form / Trigger */}
          {isAdding ? (
            <form onSubmit={handleAddSubtask} className="p-3 bg-white border border-violet-200 rounded-2xl shadow-2xs space-y-2 mt-2">
              <input
                type="text"
                required
                autoFocus
                placeholder="Tulis langkah kerja tambahan..."
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-violet-500 font-medium"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Durasi:</span>
                  <select
                    value={newStepDuration}
                    onChange={(e) => setNewStepDuration(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-mono focus:outline-none"
                  >
                    <option value={15}>15 menit</option>
                    <option value={25}>25 menit</option>
                    <option value={35}>35 menit</option>
                    <option value={45}>45 menit</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-lg transition active:scale-95 shadow-2xs"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-slate-300 hover:border-violet-400 bg-white/60 hover:bg-violet-50/50 text-slate-500 hover:text-violet-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] mt-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Tambah Langkah Manual</span>
            </button>
          )}
        </div>
      )}
    </article>
  )
}
