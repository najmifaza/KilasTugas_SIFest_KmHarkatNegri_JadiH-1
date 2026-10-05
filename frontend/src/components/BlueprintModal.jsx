import React, { useState } from 'react'
import { Check, Download, BookOpen, Clock, AlertCircle, Sparkles, X } from 'lucide-react'
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
  if (!blueprint) return null

  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')

  // Calculate default deadline: 4 days from today
  const defaultDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 4)
    return d.toISOString().split('T')[0]
  }
  const [deadlineDate, setDeadlineDate] = useState(defaultDate())

  const totalMinutes = (blueprint.subtasks || []).reduce(
    (acc, curr) => acc + (Number(curr.duration_minutes) || 25),
    0
  )

  const handleImport = async () => {
    setImporting(true)
    setError('')
    try {
      const sid = getSessionId()
      const deadlineISO = new Date(`${deadlineDate}T23:59:00`).toISOString()
      const res = await cloneBlueprint(blueprint.id, sid, deadlineISO)

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#6366F1', '#10B981', '#F59E0B'],
        })
      } catch (e) {}

      if (onImportSuccess) {
        onImportSuccess(res.task_id)
      }
    } catch (err) {
      console.error('Import error:', err)
      setError(err?.response?.data?.detail || 'Gagal mengimpor cetak biru tugas. Silakan coba lagi.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header Badge & Close Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/70">
            <Sparkles className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
            <span>Cetak Biru Tugas Terverifikasi</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Tutup"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Subject */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {CATEGORY_MAP[blueprint.category] || 'Tugas Kuliah'}
            </span>
            {blueprint.subject && (
              <span className="flex items-center gap-1 text-xs text-slate-600 font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {blueprint.subject}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {blueprint.title}
          </h2>
          {blueprint.description && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {blueprint.description}
            </p>
          )}
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <div>
            <span className="block text-[11px] font-semibold text-slate-500">
              Jumlah Langkah
            </span>
            <span className="text-base font-bold text-slate-900">
              {blueprint.subtasks?.length || 0} Langkah Kerja
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-500">
              Total Waktu Fokus
            </span>
            <span className="text-base font-bold text-slate-900 font-mono">
              ~{totalMinutes} Menit
            </span>
          </div>
        </div>

        {/* Subtasks Preview List */}
        <div>
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Rincian Micro-Pacing:
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(blueprint.subtasks || []).map((sub, idx) => (
              <div
                key={sub.id || idx}
                className="p-2.5 bg-white border border-slate-200/80 rounded-xl flex items-start gap-2.5 text-left"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {sub.title}
                  </p>
                  {sub.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {sub.description}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-500 shrink-0 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/50">
                  {sub.duration_minutes || 25}m
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Set Target Deadline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Target Tenggat Waktu Anda:
          </label>
          <input
            type="date"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleImport}
          disabled={importing}
          className="w-full py-3.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-lg shadow-black/15 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-50"
        >
          {importing ? (
            <span>Menyalin ke Jadwal Anda...</span>
          ) : (
            <>
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Impor ke Jadwalku (1 Detik)</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
