import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Inbox } from 'lucide-react'
import AppHeader from './components/AppHeader'
import HeroOverview from './components/HeroOverview'
import DateStrip from './components/DateStrip'
import TaskCard from './components/TaskCard'
import TaskDetailModal from './components/TaskDetailModal'
import TaskInputModal from './components/TaskInputModal'
import { getTasks, initSession, deleteTask } from './api'

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

  const filteredTasks = tasks.filter((t) => {
    const d = new Date(t.deadline)
    d.setHours(0, 0, 0, 0)

    if (selectedDate) {
      return d.getTime() === selectedDate.getTime()
    }

    if (activeTab === 'completed') {
      return isTaskCompleted(t)
    }

    if (activeTab === 'today') {
      const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
      return !isTaskCompleted(t) && diffDays <= 2
    }

    // Default 'all' or 'schedule'
    return true
  })

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
        <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
          <h3 className="text-xl font-semibold text-[#18181B] tracking-tight truncate">
            {selectedDate ? 'Tugas Terjadwal' : 'Tugas Hari Ini'}
          </h3>
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null)
              setActiveTab('all')
            }}
            className="text-[13px] font-medium text-[#52525B] hover:text-[#18181B] shrink-0 cursor-pointer"
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
                  onSubtaskChange={loadTasks}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button (FAB) on mobile for quick task creation */}
      <button
        type="button"
        onClick={() => setIsInputModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#18181B] text-white shadow-xl shadow-black/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 sm:hidden"
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

      {activeDetail && (
        <TaskDetailModal
          subtask={activeDetail.subtask}
          task={activeDetail.task}
          isOpen={Boolean(activeDetail)}
          onClose={() => setActiveDetail(null)}
          onComplete={() => loadTasks()}
        />
      )}
    </div>
  )
}
