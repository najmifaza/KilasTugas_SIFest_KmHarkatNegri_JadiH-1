import React, { useState, useEffect } from 'react'
import { Check, Clock, ChevronRight, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { getSubtasks, patchSubtask } from '../api'

const CATEGORY_MAP = {
  laporan_lab: 'Laporan Lab',
  makalah: 'Makalah Teori',
  coding: 'Projek Coding',
  presentasi: 'Presentasi',
  custom: 'Tugas Lain',
}

export default function TaskCard({ task, onOpenDetail, onDeleteTask }) {
  const [subtasks, setSubtasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)

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

  const toggleSubtask = async (e, st) => {
    e.stopPropagation()
    const nextState = !st.is_completed

    // Optimistic UI update
    setSubtasks((prev) =>
      prev.map((s) => (s.id === st.id ? { ...s, is_completed: nextState } : s))
    )

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

  let pacing = { label: 'Tepat Waktu', color: 'text-stone-600 bg-stone-100' }
  if (isAllDone) {
    pacing = { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50' }
  } else if (isOverdue) {
    pacing = { label: 'Terlambat', color: 'text-rose-700 bg-rose-50' }
  } else if (diffDays <= 1 && percent < 60) {
    pacing = { label: 'Mepet', color: 'text-amber-700 bg-amber-50' }
  }

  return (
    <article className="bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {CATEGORY_MAP[task.category] || 'Tugas Kuliah'}
            </span>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pacing.color}`}>
              {pacing.label}
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            {onDeleteTask && (
              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="w-8 h-8 rounded-full text-stone-400 hover:text-rose-600 hover:bg-stone-50 flex items-center justify-center transition active:scale-90"
                title="Hapus Tugas"
                aria-label="Hapus tugas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-50 flex items-center justify-center transition active:scale-90"
              aria-label={expanded ? 'Tutup sub-tugas' : 'Buka sub-tugas'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Task Title & Details */}
        <h3 className="font-semibold text-stone-950 text-base leading-snug tracking-tight">
          {task.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
          {task.subject && (
            <>
              <span className="font-medium text-stone-700">{task.subject}</span>
              <span className="text-stone-300">•</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {isAllDone
                ? 'Target tercapai'
                : diffDays > 0
                ? `${diffDays} hari lagi`
                : diffDays === 0
                ? 'Hari ini'
                : `${Math.abs(diffDays)} hari lewat`}
            </span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>Rincian Pengerjaan</span>
            <span className="font-mono text-stone-700">{completed}/{total} langkah ({percent}%)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isAllDone ? 'bg-emerald-600' : 'bg-stone-900'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subtask List */}
      {expanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1 space-y-1.5 border-t border-stone-100 bg-stone-50/50">
          {loading && subtasks.length === 0 ? (
            <div className="text-xs text-stone-400 py-4 text-center font-medium">
              Memuat langkah kerja...
            </div>
          ) : subtasks.length === 0 ? (
            <div className="text-xs text-stone-400 py-4 text-center">
              Belum ada langkah kerja terurai.
            </div>
          ) : (
            subtasks.map((st, idx) => {
              const stepNum = st.step_number || (idx + 1)
              return (
                <div
                  key={st.id || idx}
                  onClick={() => onOpenDetail(st, task)}
                  className={`group flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                    st.is_completed
                      ? 'bg-stone-100/70 border-stone-200/60 opacity-65'
                      : 'bg-white hover:bg-stone-50 border-stone-200 shadow-soft'
                  }`}
                >
                  {/* Big accessible Touch Area for Checkbox (min 44x44) */}
                  <button
                    type="button"
                    onClick={(e) => toggleSubtask(e, st)}
                    className="w-10 h-10 -my-1 -ml-1 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 active:scale-90 transition flex-shrink-0"
                    aria-label={`Tandai ${st.title} ${st.is_completed ? 'belum selesai' : 'selesai'}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        st.is_completed
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'border-stone-300 bg-white hover:border-stone-500'
                      }`}
                    >
                      {st.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>

                  {/* Step Order Badge */}
                  <span className="font-mono text-[10px] font-bold text-stone-400 px-1">
                    {String(stepNum).padStart(2, '0')}
                  </span>

                  {/* Title and metadata */}
                  <div className="flex-1 min-w-0 pr-1">
                    <p
                      className={`text-xs font-medium leading-snug line-clamp-1 ${
                        st.is_completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {st.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 font-mono">
                      <span>{st.duration_minutes || 25}m</span>
                      {st.target_date && <span>• {st.target_date}</span>}
                    </div>
                  </div>

                  {/* Action chevron */}
                  <div className="w-6 h-6 flex items-center justify-center text-stone-300 group-hover:text-stone-600 transition flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </article>
  )
}
