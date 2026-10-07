import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Inbox } from 'lucide-react'
import AppHeader from './components/AppHeader'
import HeroOverview from './components/HeroOverview'
import DateStrip from './components/DateStrip'
import TaskCard from './components/TaskCard'
import TaskDetailModal from './components/TaskDetailModal'
import TaskInputModal from './components/TaskInputModal'
import FloatingTimer from './components/FloatingTimer'
import BlueprintModal from './components/BlueprintModal'
import { getTasks, initSession, deleteTask, getBlueprint } from './api'

const playChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15) // A5
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.6)
  } catch (e) {}
}

export const isTaskCompleted = (t) => {
  if (!t) return false
  if (t.is_completed) return true
  if (t.subtasks_total > 0 && t.subtasks_done >= t.subtasks_total) return true
  if (t.progress_percent === 100) return true
  return false
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('today') // 'today' | 'all' | 'completed' | 'schedule'
  const [selectedDate, setSelectedDate] = useState(null)
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)
  const [activeDetail, setActiveDetail] = useState(null) // { subtask, task }
  const [sharedBlueprint, setSharedBlueprint] = useState(null)

  // Detect shared blueprint URL: /p/:id or ?p=:id or ?share=:id
  useEffect(() => {
    const path = window.location.pathname
    const searchParams = new URLSearchParams(window.location.search)
    let blueprintId = null

    if (path.startsWith('/p/')) {
      const parts = path.split('/p/')[1]
      blueprintId = parts ? parts.replace(/\/$/, '') : null
    } else {
      blueprintId = searchParams.get('p') || searchParams.get('share')
    }

    if (blueprintId) {
      getBlueprint(blueprintId)
        .then((res) => {
          if (res?.data) {
            setSharedBlueprint(res.data)
          }
        })
        .catch((err) => {
          console.warn('Gagal memuat cetak biru tugas:', err?.message)
        })
    }
  }, [])

  // Persistent Pomodoro Focus Timer State
  const [timerState, setTimerState] = useState({
    subtask: null,
    task: null,
    isActive: false,
    isBreak: false,
    remainingSeconds: 25 * 60,
    endTime: null,
  })

  // Request browser notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  // Timer Tick Interval based on Date.now() timestamp
  useEffect(() => {
    if (!timerState.isActive || !timerState.endTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.round((timerState.endTime - now) / 1000)

      if (diff <= 0) {
        // Pomodoro / Break Session completed
        playChime()
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200])
        }

        const wasBreak = timerState.isBreak
        const title = wasBreak ? 'Istirahat Selesai! 🔔' : 'Sesi Fokus Selesai! 🎉'
        const body = wasBreak
          ? 'Waktu istirahat habis. Siap untuk target langkah berikutnya?'
          : `Langkah "${timerState.subtask?.title}" tuntas! Istirahat sejenak 5 menit.`

        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(title, { body, icon: '/logo.png' })
          } catch (e) {}
        }

        if (!wasBreak) {
          // Switch to 5 min break
          const breakSecs = 5 * 60
          setTimerState((prev) => ({
            ...prev,
            isBreak: true,
            isActive: false,
            remainingSeconds: breakSecs,
            endTime: null,
          }))
        } else {
          // Break finished, reset to subtask duration
          const workSecs = (Number(timerState.subtask?.duration_minutes) || 25) * 60
          setTimerState((prev) => ({
            ...prev,
            isBreak: false,
            isActive: false,
            remainingSeconds: workSecs,
            endTime: null,
          }))
        }
      } else {
        setTimerState((prev) => ({ ...prev, remainingSeconds: diff }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timerState.isActive, timerState.endTime, timerState.isBreak, timerState.subtask])

  // Sync countdown to browser tab title
  useEffect(() => {
    if (timerState.isActive && timerState.subtask) {
      const m = Math.floor(timerState.remainingSeconds / 60)
      const s = timerState.remainingSeconds % 60
      const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      document.title = `(${formatted}) ${timerState.subtask.title} — KilasTugas`
    } else {
      document.title = 'KilasTugas — Perencana & Micro-Pacing Tugas Kuliah'
    }
  }, [timerState.isActive, timerState.remainingSeconds, timerState.subtask])

  // Timer Actions
  const handleStartTimer = (subtask, task, durationMinutes = 25) => {
    const secs = Number(durationMinutes) * 60 || 25 * 60
    setTimerState({
      subtask,
      task,
      isActive: true,
      isBreak: false,
      remainingSeconds: secs,
      endTime: Date.now() + secs * 1000,
    })
  }

  const handleToggleTimer = () => {
    setTimerState((prev) => {
      if (!prev.subtask) return prev
      if (prev.isActive) {
        // Pause
        const now = Date.now()
        const remaining = prev.endTime
          ? Math.max(0, Math.round((prev.endTime - now) / 1000))
          : prev.remainingSeconds
        return {
          ...prev,
          isActive: false,
          remainingSeconds: remaining,
          endTime: null,
        }
      } else {
        // Resume
        const secs =
          prev.remainingSeconds > 0
            ? prev.remainingSeconds
            : (prev.isBreak ? 5 * 60 : (Number(prev.subtask.duration_minutes) || 25) * 60)
        return {
          ...prev,
          isActive: true,
          remainingSeconds: secs,
          endTime: Date.now() + secs * 1000,
        }
      }
    })
  }

  const handleResetTimer = () => {
    setTimerState((prev) => {
      if (!prev.subtask) return prev
      const defaultSecs = prev.isBreak
        ? 5 * 60
        : (Number(prev.subtask.duration_minutes) || 25) * 60
      return {
        ...prev,
        isActive: false,
        remainingSeconds: defaultSecs,
        endTime: null,
      }
    })
  }

  const handleCloseTimer = () => {
    setTimerState({
      subtask: null,
      task: null,
      isActive: false,
      isBreak: false,
      remainingSeconds: 25 * 60,
      endTime: null,
    })
  }

  const loadTasks = async () => {
    try {
      const sid = await initSession()
      const res = await getTasks(sid)
      setTasks(res.data || [])
    } catch (err) {
      console.warn('Gagal memuat tugas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubtaskChange = async (taskId, subtaskId, isCompleted) => {
    if (taskId && subtaskId !== undefined && typeof isCompleted === 'boolean') {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t
          const doneDelta = isCompleted ? 1 : -1
          const currentDone = t.subtasks_done ?? 0
          const total = t.subtasks_total ?? 0
          const newDone = Math.max(0, Math.min(total, currentDone + doneDelta))
          const newPct = total > 0 ? Math.round((newDone / total) * 100) : 0
          const allDone = total > 0 && newDone === total
          return {
            ...t,
            subtasks_done: newDone,
            progress_percent: newPct,
            is_completed: allDone,
          }
        })
      )
    }
    await loadTasks()
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Hapus tugas ini beserta seluruh rencana kerjanya?')) return
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      alert('Gagal menghapus tugas. Silakan coba lagi.')
    }
  }

  // Filter tasks based on selectedDate or activeTab
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredTasks = tasks
    .filter((t) => {
      const d = new Date(t.deadline)
      d.setHours(0, 0, 0, 0)

      if (selectedDate) {
        return d.getTime() === selectedDate.getTime()
      }

      if (activeTab === 'completed') {
        return isTaskCompleted(t)
      }

      if (activeTab === 'today') {
        // Tampilkan semua target tugas yang belum tuntas
        return !isTaskCompleted(t)
      }

      // Default 'all'
      return true
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  return (
    <div className="min-h-screen bg-canvas-mesh flex flex-col selection:bg-slate-900 selection:text-white font-sans overflow-x-hidden w-full">
      {/* Top Header across all device viewports */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 box-border">
        <AppHeader onOpenCreate={() => setIsInputModalOpen(true)} />
      </div>

      {/* Main Responsive Content Frame */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto flex-1 flex flex-col px-4 sm:px-6 py-2 pb-12 md:pb-16 box-border min-w-0">
        
        {/* Hero Section: Dark Squircle Card with Radial Progress Ring */}
        <HeroOverview
          tasks={tasks}
          onOpenCreate={() => setIsInputModalOpen(true)}
        />

        {/* Horizontal Date Picker Carousel */}
        <div className="mb-5 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Jadwal Minggu Ini
            </span>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline cursor-pointer"
              >
                Reset Filter Tanggal
              </button>
            )}
          </div>
          <DateStrip
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
          />
        </div>

        {/* Section Header: Title + View All (Reference Screen 1: "Today's Tasks" + "View All") */}
        <div className="flex items-center justify-between gap-3 mb-3 min-w-0">
          <h3 className="text-xl font-semibold text-[#18181B] tracking-tight truncate">
            {selectedDate
              ? 'Tugas Terjadwal'
              : activeTab === 'today'
              ? 'Target Mendesak'
              : activeTab === 'completed'
              ? 'Tugas Tuntas'
              : 'Semua Tugas'}
          </h3>
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null)
              setActiveTab('all')
            }}
            className="text-xs sm:text-[13px] font-medium text-[#52525B] hover:text-[#18181B] shrink-0 whitespace-nowrap cursor-pointer underline sm:no-underline"
          >
            Lihat Semua ({tasks.length})
          </button>
        </div>

        {/* Filter Chips Bar (Screen 1 style: 44px height, inner white circle badge) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-5 no-scrollbar min-w-0 max-w-full">
          {/* Chip 1: Target Mendesak (Active: Lime Green) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('today')
              setSelectedDate(null)
            }}
            className={`h-11 rounded-full text-xs font-semibold pl-1.5 pr-4 py-1 flex items-center gap-2 transition active:scale-95 shrink-0 cursor-pointer ${
              activeTab === 'today' && !selectedDate
                ? 'bg-[#C7F263] text-[#18181B] shadow-2xs font-semibold'
                : 'bg-white text-[#18181B] shadow-2xs border border-black/5'
            }`}
          >
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#18181B] shadow-2xs shrink-0">
              {tasks.filter((t) => !isTaskCompleted(t)).length}
            </span>
            <span>Target Mendesak</span>
          </button>

          {/* Chip 2: Semua Tugas */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('all')
              setSelectedDate(null)
            }}
            className={`h-11 rounded-full text-xs font-semibold pl-1.5 pr-4 py-1 flex items-center gap-2 transition active:scale-95 shrink-0 cursor-pointer ${
              activeTab === 'all' && !selectedDate
                ? 'bg-[#18181B] text-white shadow-2xs font-semibold'
                : 'bg-white text-[#18181B] shadow-2xs border border-black/5'
            }`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                activeTab === 'all' && !selectedDate
                  ? 'bg-zinc-800 text-white'
                  : 'bg-slate-100 text-[#18181B]'
              }`}
            >
              {tasks.length}
            </span>
            <span>Semua Tugas</span>
          </button>

          {/* Chip 3: Selesai */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('completed')
              setSelectedDate(null)
            }}
            className={`h-11 rounded-full text-xs font-semibold pl-1.5 pr-4 py-1 flex items-center gap-2 transition active:scale-95 shrink-0 cursor-pointer ${
              activeTab === 'completed' && !selectedDate
                ? 'bg-[#18181B] text-white shadow-2xs font-semibold'
                : 'bg-white text-[#18181B] shadow-2xs border border-black/5'
            }`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                activeTab === 'completed' && !selectedDate
                  ? 'bg-zinc-800 text-white'
                  : 'bg-slate-100 text-[#18181B]'
              }`}
            >
              {tasks.filter((t) => isTaskCompleted(t)).length}
            </span>
            <span>Selesai</span>
          </button>
        </div>

        {/* Task Cards: 1 column on Mobile, 2 columns on Tablet & Desktop */}
        <main className="flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Menyinkronkan Tugas...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-white/80 text-center space-y-3.5 my-4 shadow-soft max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7 stroke-[1.75]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">
                  Belum ada tugas kuliah
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Masukkan modul praktikum, laporan, atau tugas besar. KilasTugas akan membaginya ke target harian teratur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInputModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Pecah Tugas Pertama</span>
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-[28px] p-8 border border-white/80 text-center space-y-2.5 my-4 shadow-soft max-w-md mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.75]" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Tidak ada target aktif
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {selectedDate
                  ? 'Tidak ada tenggat tugas pada tanggal ini.'
                  : 'Semua target dalam jadwal terdekat telah tuntas.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null)
                  setActiveTab('all')
                }}
                className="text-xs font-semibold text-slate-800 hover:text-slate-950 pt-1 underline cursor-pointer"
              >
                Lihat Semua Tugas ({tasks.length})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {filteredTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onOpenDetail={(subtask, task) => setActiveDetail({ subtask, task })}
                  onDeleteTask={handleDeleteTask}
                  onSubtaskChange={handleSubtaskChange}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Timer Pill when modal is closed but timer is running or active */}
      {!activeDetail && timerState.subtask && (
        <FloatingTimer
          timerState={timerState}
          onToggle={handleToggleTimer}
          onOpenModal={() => setActiveDetail({ subtask: timerState.subtask, task: timerState.task })}
          onCloseTimer={handleCloseTimer}
        />
      )}

      {/* Floating Action Button (FAB) on mobile for quick task creation */}
      <button
        type="button"
        onClick={() => setIsInputModalOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#18181B] text-white shadow-xl shadow-black/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 sm:hidden ${
          !activeDetail && timerState.subtask ? 'scale-90 opacity-90' : ''
        }`}
        title="Pecah Tugas Baru"
        aria-label="Pecah Tugas Baru"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Modals */}
      <TaskInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onTaskCreated={() => loadTasks()}
      />

      {/* Task Step Detail & Focus Timer Modal */}
      <TaskDetailModal
        subtask={activeDetail?.subtask}
        task={activeDetail?.task}
        isOpen={Boolean(activeDetail)}
        onClose={() => setActiveDetail(null)}
        onComplete={(updatedSubtask) => {
          if (activeDetail?.task?.id && updatedSubtask && typeof updatedSubtask.is_completed === 'boolean') {
            handleSubtaskChange(activeDetail.task.id, updatedSubtask.id, updatedSubtask.is_completed)
          } else {
            loadTasks()
          }
        }}
        timerState={timerState}
        onStartTimer={handleStartTimer}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
      />

      {/* Blueprint Task Import Modal */}
      <BlueprintModal
        blueprint={sharedBlueprint}
        onClose={() => {
          setSharedBlueprint(null)
          window.history.pushState({}, '', '/')
        }}
        onImportSuccess={() => {
          setSharedBlueprint(null)
          window.history.pushState({}, '', '/')
          loadTasks()
        }}
      />
    </div>
  )
}
