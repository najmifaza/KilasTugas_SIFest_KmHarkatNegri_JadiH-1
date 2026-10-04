import React, { useState } from 'react'
import { Sparkles, Calendar, BookOpen, FileText, Loader2 } from 'lucide-react'
import { createTask, triggerBreakdown, getSessionId } from '../api'

const CATEGORIES = [
  { id: 'laporan_lab', label: 'Laporan Lab' },
  { id: 'makalah', label: 'Makalah Teori' },
  { id: 'coding', label: 'Projek Coding' },
  { id: 'presentasi', label: 'Presentasi' },
  { id: 'custom', label: 'Custom AI' },
]

export default function TaskInputForm({ onTaskCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Default deadline = 3 hari dari sekarang pukul 23:59
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

      // 1. Simpan Task ke backend
      const taskRes = await createTask({
        session_id: sessionId,
        title: form.title.trim(),
        subject: form.subject.trim() || null,
        category: form.category,
        deadline: new Date(form.deadline).toISOString(),
        description: form.description.trim() || null,
      })

      const taskId = taskRes.task_id

      // 2. Trigger AI Breakdown
      const breakdownRes = await triggerBreakdown({
        task_id: taskId,
        title: form.title.trim(),
        description: form.description.trim() || form.title.trim(),
        category: form.category,
        deadline: new Date(form.deadline).toISOString(),
      })

      // Reset form
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
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Gagal memproses tugas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200/90 rounded-xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5 border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
            Input Tugas Baru
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            AI membagi modul kuliah menjadi tindakan kerja harian realistis.
          </p>
        </div>
        <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
          Task Chunking
        </span>
      </div>

      {error && (
        <div className="mb-4 text-xs text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Judul & Mata Kuliah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">Judul Tugas *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Laporan Praktikum Subnetting VLSM"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">Mata Kuliah</label>
            <input
              type="text"
              placeholder="Contoh: Jaringan Komputer"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:border-stone-800 transition"
            />
          </div>
        </div>

        {/* Kategori & Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">Kategori Pengerjaan</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`text-xs px-2.5 py-1 rounded-md border transition ${
                    form.category === cat.id
                      ? 'bg-stone-900 text-white border-stone-900 font-medium'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">Batas Pengumpulan (Deadline)</label>
            <input
              type="datetime-local"
              required
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-1.5 text-sm text-stone-900 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition"
            />
          </div>
        </div>

        {/* Deskripsi / Instruksi Dosen */}
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1.5">
            Instruksi / Catatan Dosen
          </label>
          <textarea
            rows={3}
            placeholder="Salin instruksi atau poin-poin modul penugasan..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium text-sm transition shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
              <span>Memproses analisis sub-tugas...</span>
            </>
          ) : (
            <span>Pecah Tugas Jadi Aksi Harian</span>
          )}
        </button>
      </div>
    </form>
  )
}
