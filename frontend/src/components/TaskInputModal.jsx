import React, { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { createTask, triggerBreakdown, getSessionId } from '../api'

const CATEGORIES = [
  { id: 'laporan_lab', label: 'Laporan Lab' },
  { id: 'makalah', label: 'Makalah Teori' },
  { id: 'coding', label: 'Projek Coding' },
  { id: 'presentasi', label: 'Presentasi' },
  { id: 'custom', label: 'Lainnya' },
]

const PRIORITIES = [
  { id: 'low', label: 'Rendah', active: 'bg-[#D1F2D9] text-[#1E6B37] border-[#B3E8C0]' },
  { id: 'medium', label: 'Sedang', active: 'bg-[#FFE8CC] text-[#B25900] border-[#FFD6A3]' },
  { id: 'high', label: 'Tinggi', active: 'bg-[#FFD9D9] text-[#C41C1C] border-[#FFBFBF]' },
]

export default function TaskInputModal({ isOpen, onClose, onTaskCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [priority, setPriority] = useState('medium')

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
    if (e) e.preventDefault()
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
      <div className="bg-white w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl border border-slate-200/90 max-h-[92vh] flex flex-col">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Modal Header: Close (X) left, Title center, Submit (Check) right */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Buat Tugas Baru
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="Simpan tugas"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 p-3 rounded-2xl flex-shrink-0">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 overflow-y-auto flex-1 pr-1">
          {/* Judul Tugas */}
          <div className="rounded-[16px] bg-slate-50 border border-slate-200/80 p-3.5 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-800 transition-all">
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

          {/* Deskripsi */}
          <div className="rounded-[16px] bg-slate-50 border border-slate-200/80 p-3.5 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-800 transition-all">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Instruksi / Catatan Dosen (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Tempelkan poin penting silabus atau modul praktikum..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-medium text-xs focus:outline-none resize-none"
            />
          </div>

          {/* Mata Kuliah & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-[16px] bg-slate-50 border border-slate-200/80 p-3.5 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-800 transition-all">
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

            <div className="rounded-[16px] bg-slate-50 border border-slate-200/80 p-3.5 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-800 transition-all">
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
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-slate-400 transition cursor-pointer"
                >
                  Besok
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(3)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-slate-400 transition cursor-pointer"
                >
                  3 Hari
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDeadline(7)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-slate-400 transition cursor-pointer"
                >
                  1 Minggu
                </button>
              </div>
            </div>
          </div>

          {/* Segmented Priority Selector (Screen 3 style) */}
          <div className="rounded-[16px] bg-slate-50 border border-slate-200/80 p-3.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Prioritas Pengerjaan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? p.active + ' shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Kategori Pills */}
          <div className="rounded-[16px] bg-slate-50 border border-slate-200/80 p-3.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Kategori Tugas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition font-medium cursor-pointer ${
                    form.category === cat.id
                      ? 'bg-[#18181B] text-white border-[#18181B] shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full-width Black Pill Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#18181B] hover:bg-black active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-lg shadow-black/15 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span>Sedang Menguraikan Target Harian...</span>
                </>
              ) : (
                <span>Buat &amp; Pecah Tugas</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
