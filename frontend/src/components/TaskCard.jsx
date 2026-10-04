import React, { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Play, Sparkles, AlertTriangle } from 'lucide-react'
import { getSubtasks, patchSubtask } from '../api'

export default function TaskCard({ task, onStartPomodoro }) {
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

  const toggleSubtask = async (st) => {
    const updatedStatus = !st.is_completed
    // Optimistic UI
    setSubtasks((prev) =>
      prev.map((s) => (s.id === st.id ? { ...s, is_completed: updatedStatus } : s))
    )
    try {
      await patchSubtask(st.id, { is_completed: updatedStatus })
    } catch (err) {
      // Revert if error
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

  // Pacing status
  let pacingStatus = { label: 'On Track', color: 'emerald', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
  if (isOverdue) {
    pacingStatus = { label: 'Overdue', color: 'rose', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
  } else if (diffDays <= 1 && percent < 50) {
    pacingStatus = { label: 'Behind Schedule', color: 'amber', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-zinc-100">{task.title}</h3>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${pacingStatus.bg}`}>
              {pacingStatus.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
            {task.subject && <span className="text-indigo-400 font-medium">{task.subject}</span>}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {diffDays > 0 ? `${diffDays} hari lagi` : diffDays === 0 ? 'Hari ini!' : 'Lewat deadline'}
            </span>
          </div>
        </div>

        {/* Progress percent badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-zinc-400">{completed}/{total} aksi</div>
            <div className="text-sm font-bold font-mono text-zinc-200">{percent}%</div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800/80">
        <div
          className={`h-full transition-all duration-500 ${
            percent === 100
              ? 'bg-emerald-500'
              : pacingStatus.color === 'amber'
              ? 'bg-amber-500'
              : 'bg-indigo-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Subtasks List */}
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          {loading && subtasks.length === 0 ? (
            <div className="text-xs text-zinc-500 py-3 text-center">Memuat sub-tugas...</div>
          ) : subtasks.length === 0 ? (
            <div className="text-xs text-zinc-500 py-3 text-center">Belum ada sub-tugas terurai.</div>
          ) : (
            subtasks.map((st, idx) => (
              <div
                key={st.id || idx}
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition ${
                  st.is_completed
                    ? 'bg-zinc-950/40 border-zinc-800/40 opacity-60'
                    : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleSubtask(st)}
                    className="mt-0.5 text-zinc-500 hover:text-indigo-400 transition"
                  >
                    {st.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-xs font-semibold ${st.is_completed ? 'line-through text-zinc-400' : 'text-zinc-100'}`}>
                      {st.title}
                    </h4>
                    {st.description && (
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        {st.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-500">
                      <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-300 font-mono">
                        {st.duration_minutes || 25}m
                      </span>
                      {st.target_date && <span>Target: {st.target_date}</span>}
                    </div>
                  </div>
                </div>

                {!st.is_completed && (
                  <button
                    onClick={() => onStartPomodoro(st)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 text-xs font-medium transition"
                    title="Mulai Fokus Pomodoro"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Fokus</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
