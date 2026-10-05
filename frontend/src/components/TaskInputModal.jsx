import React, { useState } from 'react'
import { X, Loader2, Sparkles, Calendar, BookOpen, Clock } from 'lucide-react'
import { createTask, triggerBreakdown, getSessionId } from '../api'

const CATEGORIES = [
  { id: 'laporan_lab', label: 'Laporan Lab' },
  { id: 'makalah', label: 'Makalah Teori' },
  { id: 'coding', label: 'Projek Coding' },
  { id: 'presentasi', label: 'Presentasi' },
  { id: 'custom', label: 'Lainnya' },
]

export default function TaskInputModal({ isOpen, onClose, onTaskCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getFutureISO = (daysAhead, hours = 23, minutes = 59) => {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    d.setHours(hours, minutes, 0, 0)
    const offset = d.getTimezoneOffset() * 60000
    const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16)
    return localISOTime
  }

  const [form, setForm] = useState({
    title: '',
    subject: '',
    category: 'coding',
    deadline: getFutureISO(3),
    description: '',
  })

  if (!isOpen) return null

  const handlePresetDeadline = (days) => {
    setForm((prev) => ({ ...prev, deadline: getFutureISO(days) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Judul tugas wajib diisi')
      return
    }
    setError('')
    setLoading(true)

    try {
      const sessionId = getSessionId()

      const taskRes = await createTask({
        session_id: sessionId,
        title: form.title.trim(),
        subject: form.subject.trim() || null,
        category: form.category,
        deadline: new Date(form.deadline).toISOString(),
        description: form.description.trim() || null,
      })

      const taskId = taskRes.task_id

      const breakdownRes = await triggerBreakdown({
        task_id: taskId,
        title: form.title.trim(),
        description: form.description.trim() || form.title.trim(),
        category: form.category,
        deadline: new Date(form.deadline).toISOString(),
      })

      setForm({
        title: '',
        subject: '',
        category: 'coding',
        deadline: getFutureISO(3),
        description: '',
      })

      if (onTaskCreated) {
        onTaskCreated({
          id: taskId,
          title: form.title,
          subject: form.subject,
          deadline: form.deadline,
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
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-5 sm:p-6 shadow-sheet sm:shadow-elevated border border-slate-200/90 max-h-[92vh] flex flex-col">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Pecah Tugas Baru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              AI akan menguraikan tugas menjadi target harian 25–45 menit.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition active:scale-95"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 p-3 rounded-2xl flex-shrink-0">
            {error}
          </div>
        )}

        {/* Form Body with BEM-U styled inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 overflow-y-auto flex-1 pr-1">
          {/* Judul Tugas */}
          <div className="rounded-[1.25rem] bg-slate-50 border border-slate-200/90 p-3.5 shadow-2xs focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Judul Tugas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Implementasi RSA & Diffie-Hellman"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-semibold text-sm focus:outline-none"
            />
          </div>

          {/* Mata Kuliah & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-[1.25rem] bg-slate-50 border border-slate-200/90 p-3.5 shadow-2xs focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mata Kuliah
              </label>
              <input
                type="text"
                placeholder="Contoh: Keamanan Info"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-semibold text-sm focus:outline-none"
              />
            </div>

            <div className="rounded-[1.25rem] bg-slate-50 border border-slate-200/90 p-3.5 shadow-2xs focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tenggat Waktu <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full bg-transparent text-slate-900 font-semibold text-xs focus:outline-none"
              />
              <div className="flex items-center gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(1)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-violet-300 transition"
                >
                  Besok
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(3)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-violet-300 transition"
                >
                  3 Hari
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(7)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-violet-300 transition"
                >
                  1 Minggu
                </button>
              </div>
            </div>
          </div>

          {/* Kategori Pills */}
          <div className="rounded-[1.25rem] bg-slate-50 border border-slate-200/90 p-3.5 shadow-2xs">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Kategori Tugas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition font-bold ${
                    form.category === cat.id
                      ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi / Prompt Tambahan */}
          <div className="rounded-[1.25rem] bg-slate-50 border border-slate-200/90 p-3.5 shadow-2xs focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Catatan / Instruksi Dosen (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Tempelkan poin penting silabus atau modul praktikum..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-medium text-xs focus:outline-none resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[1.25rem] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] disabled:opacity-50 text-white font-extrabold text-xs tracking-wide shadow-sm shadow-violet-500/20 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-violet-200" />
                  <span>Sedang Menguraikan Target Harian...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>Pecah Tugas dengan AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
