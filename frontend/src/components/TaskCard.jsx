import React, { useState, useEffect } from 'react'
import { Check, Clock, ChevronRight, ChevronDown, ChevronUp, Trash2, BookOpen, Layers } from 'lucide-react'
import { getSubtasks, patchSubtask } from '../api'

const CATEGORY_COLORS = {
  laporan_lab: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  makalah: { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  coding: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  presentasi: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  custom: { bg: 'bg-stone-50 text-stone-700 border-stone-200', dot: 'bg-stone-400' },
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
    const updatedStatus = !st.is_completed
    setSubtasks((prev) =>
      prev.map((s) => (s.id === st.id ? { ...s, is_completed: updatedStatus } : s))
    )
    try {
      await patchSubtask(st.id, { is_completed: updatedStatus })
    } catch (err) {
      setSubtasks((prev) =>
        prev.map((s) => (s.id === st.id ? { ...s, is_completed: st.is_completed } : s))
      )
    }
  }

  // Calculate progress & pacing
  const total = subtasks.length
  const completed = subtasks.filter((s) => s.is_completed).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  const deadlineDate = new Date(task.deadline)
  const now = new Date()
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))
  const isOverdue = diffDays < 0 && percent < 100

  let pacing = { label: 'On Track', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
  if (isOverdue) {
    pacing = { label: 'Overdue', color: 'bg-rose-50 text-rose-800 border-rose-200' }
  } else if (diffDays <= 1 && percent < 50) {
    pacing = { label: 'Behind', color: 'bg-amber-50 text-amber-800 border-amber-200' }
  }

  const categoryStyle = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.custom

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-card space-y-4 transition">
      
      {/* Top Header Card */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${categoryStyle.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
            <span className="capitalize">{task.category?.replace('_', ' ') || 'Tugas'}</span>
          </span>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${pacing.color}`}>
            {pacing.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onDeleteTask && (
            <button
              onClick={() => onDeleteTask(task.id)}
              className="w-7 h-7 rounded-full hover:bg-stone-100 text-stone-400 hover:text-rose-600 flex items-center justify-center transition"
              title="Hapus Tugas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Task Title & Subject */}
      <div>
        <h3 className="font-bold text-base text-stone-900 leading-snug">
          {task.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
          {task.subject && (
            <span className="font-medium text-stone-700">{task.subject} •</span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {diffDays > 0 ? `${diffDays} hari lagi` : diffDays === 0 ? 'Hari ini!' : 'Lewat deadline'}
          </span>
        </div>
      </div>

      {/* Slim Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
          <span>Progres Eksekusi</span>
          <span className="font-mono text-stone-700">{completed}/{total} aksi ({percent}%)</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-stone-900 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Subtask Schedule Stack (Inspired by Mockup Cards) */}
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-stone-100">
          {loading && subtasks.length === 0 ? (
            <div className="text-xs text-stone-400 py-3 text-center">Memuat sub-tugas...</div>
          ) : subtasks.length === 0 ? (
            <div className="text-xs text-stone-400 py-3 text-center">Belum ada sub-tugas terurai.</div>
          ) : (
            subtasks.map((st, idx) => (
              <div
                key={st.id || idx}
                onClick={() => onOpenDetail(st, task)}
                className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border transition cursor-pointer select-none active:scale-[0.99] ${
                  st.is_completed
                    ? 'bg-stone-50/60 border-stone-200/60 opacity-60'
                    : 'bg-[#FAFBFD] hover:bg-white border-stone-200/90 shadow-xs'
                }`}
              >
                {/* Left check circle */}
                <button
                  type="button"
                  onClick={(e) => toggleSubtask(e, st)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition border ${
                    st.is_completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-stone-300 hover:border-stone-500 bg-white'
                  }`}
                >
                  {st.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Subtask Info */}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${st.is_completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                    {st.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-700">
                      {st.duration_minutes || 25} min
                    </span>
                    <span>Langkah {st.step_number || (idx + 1)}</span>
                    {st.target_date && <span>• {st.target_date}</span>}
                  </div>
                </div>

                {/* Right Arrow / Open Detail */}
                <div className="w-7 h-7 rounded-full bg-white group-hover:bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-stone-700 transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}
