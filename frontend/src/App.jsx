import React, { useState, useEffect } from 'react'
import { Sparkles, CheckSquare, Zap, BookOpen, Layers } from 'lucide-react'
import TaskInputForm from './components/TaskInputForm'
import TaskCard from './components/TaskCard'
import PomodoroModal from './components/PomodoroModal'
import HealthBanner from './components/HealthBanner'
import { getTasks, initSession, getSessionId } from './api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePomodoroSubtask, setActivePomodoroSubtask] = useState(null)

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

  const handleTaskCreated = () => {
    loadTasks()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                KilasTugas
                <span className="text-[10px] font-normal bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.2 rounded">
                  SIFest DIC 2026
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Problem First, Technology Second — Actionable Task Breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HealthBanner />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8 space-y-8">
        {/* Hero Quote */}
        <div className="text-center py-2 space-y-1">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Jangan tanya &quot;kapan selesai&quot;, tanya &quot;apa yang dikerjakan hari ini&quot;.
          </h2>
          <p className="text-xs md:text-sm text-zinc-400">
            Ubah instruksi tugas yang panjang menjadi sub-tugas harian realistis dan terukur.
          </p>
        </div>

        {/* Input Form Section */}
        <TaskInputForm onTaskCreated={handleTaskCreated} />

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              Daftar Tugas Aktif
            </h3>
            <span className="text-xs text-zinc-500">
              {tasks.length} tugas tersimpan
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              Menghubungkan ke backend dan memuat daftar tugas...
            </div>
          ) : tasks.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center space-y-2">
              <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-medium text-zinc-300">Belum ada tugas</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Masukkan tugas kuliah pertama Anda di atas untuk melihat sihir pembagian sub-tugas harian.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStartPomodoro={(subtask) => setActivePomodoroSubtask(subtask)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Focus Mode Pomodoro Modal */}
      {activePomodoroSubtask && (
        <PomodoroModal
          subtask={activePomodoroSubtask}
          onClose={() => setActivePomodoroSubtask(null)}
          onComplete={(st) => {
            // Reload tasks on complete
            loadTasks()
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-4 text-center text-xs text-zinc-600 font-mono">
        SIFest Digital Innovation Challenge 2026 — Track: Education • KilasTugas MVP
      </footer>
    </div>
  )
}
