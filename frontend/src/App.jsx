import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Inbox, Calendar, CheckCheck, ListFilter } from 'lucide-react'
import TaskCard from './components/TaskCard'
import TaskDetailModal from './components/TaskDetailModal'
import TaskInputModal from './components/TaskInputModal'
import HealthBanner from './components/HealthBanner'
import { getTasks, initSession, deleteTask } from './api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('upcoming') // 'upcoming' | 'all'
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

  // Filter tasks
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true
    const d = new Date(t.deadline)
    const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
    // Upcoming = not completed, within 5 days or already overdue
    return !t.is_completed && diffDays <= 5
  })

  // Summary counts
  const totalCompleted = tasks.filter((t) => t.is_completed).length
  const pendingCount = tasks.filter((t) => !t.is_completed).length

  // Indonesian date formatter
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="min-h-screen bg-stone-100 flex justify-center selection:bg-stone-800 selection:text-white">
      {/* Mobile-First Frame: Edge-to-edge on mobile, sleek centered container on tablet/desktop */}
      <div className="w-full max-w-xl min-h-screen bg-[#fafaf9] flex flex-col sm:border-x sm:border-stone-200/90 sm:shadow-soft">
        
        {/* Top App Header */}
        <header className="sticky top-0 z-30 bg-[#fafaf9]/95 backdrop-blur-md px-4 sm:px-6 pt-4 pb-3 border-b border-stone-200/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-soft">
                KT
              </div>
              <div>
                <h1 className="text-sm font-bold text-stone-950 tracking-tight leading-none">
                  KilasTugas
                </h1>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <HealthBanner />
              <button
                type="button"
                onClick={() => setIsInputModalOpen(true)}
                className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition active:scale-95 shadow-soft"
                title="Tambah Tugas Baru"
                aria-label="Tambah Tugas"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-200/60">
            <div className="bg-white rounded-xl p-2.5 border border-stone-200/80 shadow-soft">
              <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                Tugas Berjalan
              </div>
              <div className="text-lg font-bold text-stone-950 font-mono mt-0.5">
                {pendingCount}
              </div>
            </div>

            <div className="bg-white rounded-xl p-2.5 border border-stone-200/80 shadow-soft">
              <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                Target Selesai
              </div>
              <div className="text-lg font-bold text-stone-950 font-mono mt-0.5">
                {totalCompleted}
              </div>
            </div>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1.5 mt-3 bg-stone-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('upcoming')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition active:scale-98 ${
                filter === 'upcoming'
                  ? 'bg-white text-stone-950 shadow-soft'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Fokus Mendatang ({tasks.filter((t) => !t.is_completed).length})
            </button>

            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition active:scale-98 ${
                filter === 'all'
                  ? 'bg-white text-stone-950 shadow-soft'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Tugas ({tasks.length})
            </button>
          </div>
        </header>

        {/* Task Cards List Area */}
        <main className="flex-1 px-4 sm:px-6 py-4 space-y-3.5 pb-28">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">Memuat jadwal tugas...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-200/90 text-center space-y-3 my-6 shadow-soft">
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-stone-950">
                  Belum ada daftar tugas kuliah
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Masukkan tugas besar atau modul praktikum. KilasTugas akan membaginya ke dalam sub-tugas harian terukur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInputModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-950 text-white font-medium text-xs hover:bg-stone-850 transition active:scale-95 shadow-soft"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah Tugas Pertama</span>
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-200/90 text-center space-y-2 my-6 shadow-soft">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.5]" />
              <h3 className="font-semibold text-sm text-stone-950">
                Tidak ada tugas mendesak
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Semua tugas dalam 5 hari ke depan telah selesai atau belum ada tenggat terdekat.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="text-xs text-stone-800 underline font-medium pt-1"
              >
                Lihat Semua Tugas
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onOpenDetail={(subtask, task) => setActiveDetail({ subtask, task })}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </main>

        {/* Sticky Mobile Dock (Clean Ergonomics, No Content Clipping) */}
        <div className="fixed bottom-0 inset-x-0 sm:sticky sm:bottom-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-3 sm:px-6 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
            <span className="text-xs text-stone-500 font-medium">
              {filteredTasks.length} tugas ditampilkan
            </span>

            <button
              type="button"
              onClick={() => setIsInputModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-850 text-white font-medium text-xs shadow-soft transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Tugas</span>
            </button>
          </div>
        </div>

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
            onClose={() => setActiveDetail(null)}
            onComplete={() => loadTasks()}
          />
        )}

      </div>
    </div>
  )
}
