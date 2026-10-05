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
    <div className="min-h-screen bg-slate-50 flex justify-center selection:bg-violet-600 selection:text-white">
      {/* Mobile-Centric Container (Edge-to-edge on mobile, centered max-w-md on desktop) */}
      <div className="w-full max-w-md min-h-screen bg-[#F8FAFC] flex flex-col sm:border-x sm:border-slate-200/90 sm:shadow-card relative">
        
        {/* Top App Header (Identical to BEM-U AppHeader) */}
        <AppHeader />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-5 py-4 space-y-4 pb-28">
          {/* Hero Overview: Gradient Card + 3 Metric Grid */}
          <HeroOverview
            tasks={tasks}
            onOpenCreate={() => setIsInputModalOpen(true)}
          />

          {/* Filter Pills */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
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
              className="text-xs font-bold text-violet-700 hover:text-violet-800 flex items-center gap-1 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Task Cards List Area */}
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Menyinkronkan Tugas...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-7 border border-slate-200/90 text-center space-y-3 my-4 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Belum ada tugas kuliah
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Masukkan modul praktikum atau tugas besar. KilasTugas akan membaginya ke target harian terukur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInputModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Pecah Tugas Pertama</span>
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-7 border border-slate-200/90 text-center space-y-2 my-4 shadow-2xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.75]" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Tidak ada target mendesak
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Semua tugas dalam jadwal terdekat telah tuntas atau terjadwal rapi.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="text-xs text-violet-700 font-bold pt-1 underline"
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

        {/* Floating Bottom Dock (Identical to BEM-U Dock) */}
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
    </div>
  )
}
