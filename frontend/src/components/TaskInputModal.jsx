import React, { useState } from 'react'
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react'
import { createTask, triggerBreakdown, getSessionId } from '../api'

const CATEGORIES = [
  { id: 'laporan_lab', label: 'Laporan Lab', dot: 'bg-emerald-500' },
  { id: 'makalah', label: 'Makalah Teori', dot: 'bg-indigo-500' },
  { id: 'coding', label: 'Projek Coding', dot: 'bg-blue-500' },
  { id: 'presentasi', label: 'Presentasi', dot: 'bg-amber-500' },
  { id: 'custom', label: 'Lainnya', dot: 'bg-stone-400' },
]

export default function TaskInputModal({ isOpen, onClose, onTaskCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const defaultDate = new Date()
  defaultDate.setDate(defaultDate.getDate() + 3)
  const defaultDeadline = defaultDate.toISOString().slice(0, 16)

  const [form, setForm] = useState({
    title: '',
    subject: '',
    category: 'coding',
    deadline: defaultDeadline,
    description: '',
  })

  if (!isOpen) return null

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
        deadline: defaultDeadline,
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
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-t-4xl sm:rounded-4xl p-6 shadow-2xl relative border border-stone-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Pecah Tugas Kuliah
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              AI akan menguraikannya jadi langkah kerja harian.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 text-xs text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Judul Tugas *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Makalah Jaringan Komputer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Mata Kuliah
              </label>
              <input
                type="text"
                placeholder="Contoh: Praktikum Jarkom"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Batas Deadline
              </label>
              <input
                type="datetime-local"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Kategori Tugas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 ${
                    form.category === cat.id
                      ? 'bg-[#1A202C] text-white border-[#1A202C] font-medium shadow-xs'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Instruksi / Catatan Tugas (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Paste deskripsi modul dosen atau instruksi praktikum di sini..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#F26A36] hover:bg-[#e05b29] disabled:opacity-50 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-[#F26A36]/20 active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>AI Sedang Menganalisis Tugas...</span>
              </>
            ) : (
              <>
                <span>Pecah Jadi Sub-Tugas Harian</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
