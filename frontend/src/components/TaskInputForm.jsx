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
    <form onSubmit={handleSubmit} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Pecah Tugas Baru
        </h2>
        <span className="text-xs text-zinc-500 font-mono">Micro-Pacing Engine</span>
      </div>

      {error && (
        <div className="mb-4 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Judul & Mata Kuliah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Judul Tugas *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Laporan Praktikum Subnetting VLSM"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Mata Kuliah</label>
            <input
              type="text"
              placeholder="Contoh: Jaringan Komputer"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Kategori & Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Kategori Tugas</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                    form.category === cat.id
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Batas Pengumpulan (Deadline)</label>
            <input
              type="datetime-local"
              required
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Deskripsi / Instruksi Dosen */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Instruksi / Detail Tugas (Paste modul dosen di sini)
          </label>
          <textarea
            rows={3}
            placeholder="Paste instruksi lengkap dari dosen... AI akan otomatis menganalisis dan membaginya per hari."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses AI Breakdown (9Router)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Pecah Tugasku Jadi Aksi Harian</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
