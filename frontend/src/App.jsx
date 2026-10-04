import React, { useState, useEffect } from 'react'
import { Plus, CheckSquare, Layers, CheckCircle2 } from 'lucide-react'
import TaskCard from './components/TaskCard'
import TaskDetailModal from './components/TaskDetailModal'
import TaskInputModal from './components/TaskInputModal'
import HealthBanner from './components/HealthBanner'
import { getTasks, initSession, deleteTask } from './api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('today') // 'today' | 'all'
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)
  const [activeDetail, setActiveDetail] = useState(null) // { subtask, task }

  const loadTasks = async () => {
    try {
      const sid = await initSession()
      const res = await getTasks(sid)
      setTasks(res.data || [])
    } catch (err) {
      console.warn('Load tasks error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Hapus tugas ini beserta seluruh sub-tugasnya?')) return
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      alert('Gagal menghapus tugas')
    }
  }

  // Filter tasks
  const today = new Date()
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true
    const d = new Date(t.deadline)
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
    return diff <= 5 && !t.is_completed
  })

  // Format today's date
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'short' }
  const formattedToday = new Intl.DateTimeFormat('id-ID', dateOptions).format(today)

  return (
    <div className="bg-stone-200 min-h-screen py-0 md:py-8 flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md min-h-screen md:min-h-[860px] bg-[#F5F6FA] text-stone-900 md:rounded-[44px] md:border md:border-stone-300 md:shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Mobile Top App Bar */}
        <header className="px-5 pt-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className="w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
              KT
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Halo, Mahasiswa! 👋</div>
              <div className="text-sm font-bold text-stone-900 leading-tight">KilasTugas Plan</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HealthBanner />
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-xs active:scale-95 transition"
              title="Tambah Tugas"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Filter Pills Row (Inspired by Mockup) */}
        <div className="px-5 py-2 flex items-center gap-2.5">
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition active:scale-95 ${
              filter === 'today'
                ? 'bg-[#F26A36] text-white shadow-sm shadow-[#F26A36]/30'
                : 'bg-white text-stone-600 border border-stone-200/90'
            }`}
          >
            Hari Ini
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition active:scale-95 ${
              filter === 'all'
                ? 'bg-[#F26A36] text-white shadow-sm shadow-[#F26A36]/30'
                : 'bg-white text-stone-600 border border-stone-200/90'
            }`}
          >
            Semua Tugas ({tasks.length})
          </button>

          <button
            onClick={() => setIsInputModalOpen(true)}
            className="w-8 h-8 rounded-full bg-[#F26A36] hover:bg-[#e05b29] text-white flex items-center justify-center shadow-sm active:scale-90 transition ml-auto"
            title="Pecah Tugas Baru"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Big Heading (Mockup Style) */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 leading-tight">
            Cek target tugasmu hari ini
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            {formattedToday} • {filteredTasks.length} tugas aktif terdeteksi
          </p>
        </div>

        {/* Main Content / Tasks Stack */}
        <main className="flex-1 px-5 py-3 space-y-4 overflow-y-auto pb-24">
          {loading ? (
            <div className="py-16 text-center text-xs text-stone-400 font-medium">
              Menghubungkan ke VPS &amp; memuat tugas...
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 text-center space-y-3 mt-4 shadow-card">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Belum ada tugas kuliah</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Pecah instruksi modul atau tugas kuliah yang berat menjadi sub-tugas harian realistis.
              </p>
              <button
                onClick={() => setIsInputModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F26A36] text-white font-semibold text-xs shadow-sm hover:bg-[#e05b29] transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Pecah Tugas Pertama</span>
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 text-center space-y-2 mt-4 shadow-card">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-stone-900">Semua target hari ini selesai!</h3>
              <p className="text-xs text-stone-500">
                Pindah ke tab &quot;Semua Tugas&quot; untuk melihat jadwal berikutnya.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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

        {/* Floating Quick Action Button on Bottom (Mobile-friendly) */}
        <div className="absolute bottom-4 inset-x-0 flex flex-col items-center pointer-events-none">
          <button
            onClick={() => setIsInputModalOpen(true)}
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full bg-[#1A202C] hover:bg-stone-800 text-white font-semibold text-xs shadow-float active:scale-95 transition mb-2"
          >
            <Plus className="w-4 h-4 text-[#F26A36] stroke-[3]" />
            <span>Pecah Tugas Baru</span>
          </button>

          {/* iOS Home Indicator Bar */}
          <div className="w-32 h-1 bg-stone-300 rounded-full" />
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
