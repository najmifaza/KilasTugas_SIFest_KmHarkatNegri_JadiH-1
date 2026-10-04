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
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-stone-200/80 bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-stone-900 text-white font-black text-sm flex items-center justify-center">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-sm tracking-tight text-stone-900">
                  KilasTugas
                </h1>
                <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                  SIFest DIC 2026
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HealthBanner />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-7">
        {/* Editorial Header */}
        <div className="space-y-1.5">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900">
            Rencana Aksi &amp; Micro-Pacing Tugas
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Pecah instruksi modul kuliah yang padat menjadi target harian konkret berdurasi 25–45 menit.
          </p>
        </div>

        {/* Input Form Section */}
        <TaskInputForm onTaskCreated={handleTaskCreated} />

        {/* Tasks Section */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Daftar Tugas Aktif
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              {tasks.length} tugas
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              Memuat daftar tugas...
            </div>
          ) : tasks.length === 0 ? (
            <div className="border border-dashed border-stone-300 rounded-xl p-8 text-center bg-white space-y-1">
              <p className="text-sm font-medium text-stone-700">Belum ada tugas</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Isi form di atas untuk membuat breakdown pertama.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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
            loadTasks()
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 py-5 text-center text-xs text-stone-400 font-mono">
        KilasTugas • Problem First, Technology Second
      </footer>
    </div>
  )
}
