import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Inbox, Sparkles, Layers, Calendar } from 'lucide-react'
import AppHeader from './components/AppHeader'
import HeroOverview from './components/HeroOverview'
import TaskCard from './components/TaskCard'
import TaskDetailModal from './components/TaskDetailModal'
import TaskInputModal from './components/TaskInputModal'
import Dock from './components/Dock'
import { getTasks, initSession, deleteTask } from './api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'today' | 'all'
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

  // Filter tasks based on activeTab
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'all') return true
    const d = new Date(t.deadline)
    const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
    // Today filter = within 1-2 days or overdue
    return !t.is_completed && diffDays <= 2
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Top Header across all device viewports */}
      <AppHeader onOpenCreate={() => setIsInputModalOpen(true)} />

      {/* Main Responsive Content Frame (Mobile full, Tablet max-w-3xl, Desktop max-w-6xl) */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto flex-1 flex flex-col px-4 sm:px-6 py-4 md:py-6 pb-28 md:pb-28">
        
        {/* Hero Section: Banner + Metric Grid */}
        <HeroOverview
          tasks={tasks}
          onOpenCreate={() => setIsInputModalOpen(true)}
        />

        {/* Filter Bar & Quick Add */}
        <div className="flex items-center justify-between gap-3 mb-4 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua Tugas ({tasks.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Target Mendesak ({tasks.filter((t) => !t.is_completed).length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsInputModalOpen(true)}
            className="text-xs font-bold text-violet-700 hover:text-violet-800 flex items-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Tugas</span>
          </button>
        </div>

        {/* Task Cards: 1 column on Mobile, 2 columns on Tablet & Desktop */}
        <main className="flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Menyinkronkan Tugas...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-[1.8rem] p-8 sm:p-10 border border-slate-200/90 text-center space-y-3.5 my-4 shadow-2xs max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
                <Inbox className="w-7 h-7 stroke-[1.75]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">
                  Belum ada tugas kuliah
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Masukkan modul praktikum, laporan, atau tugas besar. KilasTugas akan membaginya ke target harian teratur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInputModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Pecah Tugas Pertama</span>
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-[1.8rem] p-8 border border-slate-200/90 text-center space-y-2.5 my-4 shadow-2xs max-w-md mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.75]" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Tidak ada target mendesak
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Semua tugas dalam jadwal terdekat telah tuntas atau terjadwal dengan rapi.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="text-xs font-bold text-violet-700 hover:text-violet-800 pt-1 underline cursor-pointer"
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
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom Navigation Dock (Edge-to-edge on mobile, floating pill on tablet/desktop) */}
      <Dock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreate={() => setIsInputModalOpen(true)}
      />

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
