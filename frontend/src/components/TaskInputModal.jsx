import React, { useState } from 'react'
import { X, Check, Loader2, Calendar, Clock, Folder, ChevronDown } from 'lucide-react'
import { createTask, triggerBreakdown, getSessionId } from '../api'

const DEFAULT_TAGS = ['Design', 'UI/UX', 'Work']

const CATEGORIES = [
  { id: 'coding', label: 'Website Redesign' },
  { id: 'laporan_lab', label: 'Laporan Praktikum' },
  { id: 'makalah', label: 'Makalah Teori' },
  { id: 'presentasi', label: 'Presentasi Proyek' },
  { id: 'custom', label: 'Lainnya' },
]

export default function TaskInputModal({ isOpen, onClose, onTaskCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [priority, setPriority] = useState('medium')
  const [tags, setTags] = useState(DEFAULT_TAGS)
  const [newTagInput, setNewTagInput] = useState('')
  const [showAddTag, setShowAddTag] = useState(false)

  // Split date and time defaults
  const getDefaultDate = (daysAhead = 3) => {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    return d.toISOString().slice(0, 10)
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: getDefaultDate(3),
    time: '10:00',
    category: 'coding',
    subject: 'Website Redesign',
  })

  if (!isOpen) return null

  const handlePresetDate = (days) => {
    setForm((prev) => ({ ...prev, date: getDefaultDate(days) }))
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove))
  }

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags((prev) => [...prev, newTagInput.trim()])
      setNewTagInput('')
      setShowAddTag(false)
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!form.title.trim()) {
      setError('Judul tugas wajib diisi')
      return
    }
    setError('')
    setLoading(true)

    try {
      const sessionId = getSessionId()
      const deadlineISO = new Date(`${form.date}T${form.time}:00`).toISOString()

      const taskRes = await createTask({
        session_id: sessionId,
        title: form.title.trim(),
        subject: form.subject.trim() || null,
        category: form.category,
        deadline: deadlineISO,
        description: form.description.trim() || null,
      })

      const taskId = taskRes.task_id

      const breakdownRes = await triggerBreakdown({
        task_id: taskId,
        title: form.title.trim(),
        description: form.description.trim() || form.title.trim(),
        category: form.category,
        deadline: deadlineISO,
      })

      setForm({
        title: '',
        description: '',
        date: getDefaultDate(3),
        time: '10:00',
        category: 'coding',
        subject: 'Website Redesign',
      })

      if (onTaskCreated) {
        onTaskCreated({
          id: taskId,
          title: form.title,
          subject: form.subject,
          deadline: deadlineISO,
          source: breakdownRes.source,
          subtasks: breakdownRes.data,
        })
      }
      onClose()
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Gagal memproses tugas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-[#F7F4EF] p-5 sm:p-6 shadow-2xl border border-white/80 max-h-[94vh] flex flex-col font-sans text-zinc-900">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

        {/* Header: White Circular Buttons + Centered Title */}
        <header className="flex items-center justify-between pb-3 shrink-0">
          {/* Close Button (48px white circle) */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xs text-zinc-800 hover:bg-slate-50 transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Centered Title */}
          <h2 className="text-[17px] font-bold text-zinc-900 tracking-tight">
            Add New Task
          </h2>

          {/* Submit Button (48px white circle) */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-xs text-zinc-800 hover:bg-slate-50 transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Simpan tugas"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
          </button>
        </header>

        {error && (
          <div className="my-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-2xl shrink-0">
            {error}
          </div>
        )}

        {/* Form Body (Scrollable fields) */}
        <form id="task-form" onSubmit={handleSubmit} className="space-y-3.5 overflow-y-auto flex-1 pr-1 pt-2 no-scrollbar">
          {/* 1. Task Title */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="Finish landing page design"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full h-12 bg-white rounded-2xl px-4 text-sm text-zinc-800 font-medium shadow-xs focus:outline-none border border-slate-100 placeholder-zinc-400"
            />
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Design the new landing page for the product launch."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white rounded-2xl p-3.5 text-sm text-zinc-800 font-medium shadow-xs focus:outline-none resize-none border border-slate-100 placeholder-zinc-400"
            />
          </div>

          {/* 3. Due Date & Time */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">
              Due Date & time
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Date Box */}
              <div className="h-12 bg-white rounded-2xl px-4 flex items-center gap-2 text-sm text-zinc-700 font-medium shadow-xs border border-slate-100 relative">
                <Calendar className="w-4 h-4 text-zinc-800 shrink-0 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-transparent text-sm text-zinc-800 font-medium focus:outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>

              {/* Time Box */}
              <div className="h-12 bg-white rounded-2xl px-4 flex items-center gap-2 text-sm text-zinc-700 font-medium shadow-xs border border-slate-100 relative">
                <Clock className="w-4 h-4 text-zinc-800 shrink-0 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full bg-transparent text-sm text-zinc-800 font-medium focus:outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>

            {/* Instant Shortcut Pills */}
            <div className="flex items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => handlePresetDate(1)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-zinc-700 hover:border-zinc-400 transition cursor-pointer"
              >
                Besok
              </button>
              <button
                type="button"
                onClick={() => handlePresetDate(3)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-zinc-700 hover:border-zinc-400 transition cursor-pointer"
              >
                3 Hari
              </button>
              <button
                type="button"
                onClick={() => handlePresetDate(7)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-zinc-700 hover:border-zinc-400 transition cursor-pointer"
              >
                1 Minggu
              </button>
            </div>
          </div>

          {/* 4. Priority (3 Colored Selection Pills, matching reference Screen 3) */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Low (Always green tint) */}
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2.5 rounded-2xl text-sm font-semibold transition active:scale-95 cursor-pointer text-center bg-[#E5F4E3] border text-[#2E7D32] ${
                  priority === 'low'
                    ? 'border-[#7CB685] ring-2 ring-[#7CB685]/40 shadow-xs font-bold scale-[1.02]'
                    : 'border-[#7CB685]/60 opacity-90'
                }`}
              >
                Low
              </button>

              {/* Medium (Always orange/peach tint) */}
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2.5 rounded-2xl text-sm font-semibold transition active:scale-95 cursor-pointer text-center bg-[#FDEBD2] border text-[#E76F51] ${
                  priority === 'medium'
                    ? 'border-[#F4A261] ring-2 ring-[#F4A261]/40 shadow-xs font-bold scale-[1.02]'
                    : 'border-[#F4A261]/60 opacity-90'
                }`}
              >
                Medium
              </button>

              {/* High (Always red/pink tint) */}
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2.5 rounded-2xl text-sm font-semibold transition active:scale-95 cursor-pointer text-center bg-[#FCDAD7] border text-[#D90429] ${
                  priority === 'high'
                    ? 'border-[#E76F51] ring-2 ring-[#E76F51]/40 shadow-xs font-bold scale-[1.02]'
                    : 'border-[#E76F51]/60 opacity-90'
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* 5. Project (Dropdown Bar with Folder Icon) */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">
              Project
            </label>
            <div className="h-14 w-full bg-white rounded-2xl px-4 flex items-center justify-between shadow-xs border border-slate-100 relative">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <Folder className="w-5 h-5 text-indigo-600 shrink-0 fill-indigo-100" />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-transparent text-sm font-semibold text-zinc-900 focus:outline-none cursor-pointer appearance-none pr-6"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-800 shrink-0 pointer-events-none" />
            </div>
          </div>

          {/* 6. Tags (Removable Pills + Add) */}
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#DFD8FD] border border-[#9D8DF1] text-[#5A4FCF] text-xs font-semibold rounded-2xl flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-indigo-950 transition cursor-pointer"
                    aria-label={`Hapus tag ${tag}`}
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </span>
              ))}

              {showAddTag ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Tag baru"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    className="w-24 px-3 py-1 bg-white border border-zinc-300 rounded-2xl text-xs font-medium text-zinc-800 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2.5 py-1 bg-zinc-900 text-white text-xs font-semibold rounded-2xl cursor-pointer"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddTag(true)}
                  className="px-3 py-1.5 bg-white/80 border border-zinc-200 text-zinc-600 hover:text-zinc-900 text-xs font-semibold rounded-2xl flex items-center gap-1 transition cursor-pointer"
                >
                  <span>+ Add</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* 7. Bottom CTA (Fixed at base, always in view) */}
        <div className="pt-3 pb-1 shrink-0 border-t border-zinc-200/40">
          <button
            type="submit"
            form="task-form"
            disabled={loading}
            className="w-full h-14 bg-zinc-950 hover:bg-black text-white rounded-full text-base font-semibold shadow-xl flex items-center justify-center active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                <span>Creating Task...</span>
              </div>
            ) : (
              <span>Create Task</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
