import React, { useState } from 'react'
import { X, Loader2, Calendar, FileText, BookOpen, Clock } from 'lucide-react'
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
    // Local ISO format without timezone offset for datetime-local
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
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-sheet sm:shadow-elevated border border-stone-200/80 max-h-[90vh] flex flex-col">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-stone-950">
              Buat Target Tugas Baru
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Tugas diuraikan otomatis menjadi langkah kerja harian.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition active:scale-95"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 p-2.5 rounded-lg flex-shrink-0">
            {error}
          </div>
        )}

        {/* Form Body (Scrollable if viewport is small) */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Judul Tugas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Implementasi RSA & Diffie-Hellman"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Mata Kuliah
              </label>
              <input
                type="text"
                placeholder="Contoh: Keamanan Informasi"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-base sm:text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-700">
                  Tenggat Waktu <span className="text-rose-500">*</span>
                </label>
              </div>
              <input
                type="datetime-local"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-base sm:text-xs text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white transition"
              />
              {/* Quick Deadline Presets */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(1)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                >
                  Besok
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(3)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                >
                  3 Hari
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(7)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                >
                  1 Minggu
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Kategori
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                    form.category === cat.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-soft'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Instruksi / Catatan Tambahan (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Tempelkan poin penting instruksi tugas dari dosen atau modul..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-base sm:text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-950 hover:bg-stone-850 disabled:opacity-50 text-white font-medium text-xs tracking-tight transition active:scale-98 shadow-soft"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
                  <span>Menyusun Rencana Pengerjaan...</span>
                </>
              ) : (
                <span>Simpan &amp; Urai Tugas</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
