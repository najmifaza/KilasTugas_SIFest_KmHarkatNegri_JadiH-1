import React, { useState, useEffect } from 'react'
import { ChevronLeft, Play, Pause, RotateCcw, Check, Clock, BookOpen, Sparkles, X } from 'lucide-react'

export default function TaskDetailModal({ subtask, task, onClose, onComplete }) {
  const WORK_SECONDS = (subtask?.duration_minutes || 25) * 60
  const BREAK_SECONDS = 5 * 60

  const [isBreak, setIsBreak] = useState(false)
  const [timeLeft, setTimeLeft] = useState(WORK_SECONDS)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      if (!isBreak) {
        setIsBreak(true)
        setTimeLeft(BREAK_SECONDS)
      } else {
        setIsBreak(false)
        setTimeLeft(WORK_SECONDS)
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, isBreak, WORK_SECONDS])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(isBreak ? BREAK_SECONDS : WORK_SECONDS)
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#F8F9FC] w-full max-w-md h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-4xl sm:rounded-4xl flex flex-col overflow-hidden shadow-2xl relative border border-stone-200">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 bg-white border-b border-stone-100">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <span className="text-xs font-bold text-stone-800">Detail Sub-Tugas</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 pb-28">
          {/* Category Tag */}
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F26A36] text-white shadow-xs">
              {task?.category?.replace('_', ' ') || 'Tugas Kuliah'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Langkah ke-{subtask?.step_number || 1}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-xl font-bold tracking-tight text-stone-900 leading-snug">
            {subtask?.title}
          </h2>

          {/* Meta Info Row */}
          <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {subtask?.duration_minutes || 25} Menit
            </span>
            {task?.subject && (
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-stone-700">
                <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                {task.subject}
              </span>
            )}
          </div>

          {/* AI Action Guide Card */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F26A36]" />
              <span>Instruksi Kerja Spesifik</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-normal">
              {subtask?.description || 'Lakukan pengerjaan sesuai alur target langkah ini.'}
            </p>
          </div>

          {/* Pomodoro Timer Container */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-stone-100 text-stone-700">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#F26A36] animate-pulse' : 'bg-stone-400'}`} />
              <span>{isBreak ? '☕ Istirahat 5 Menit' : isActive ? '🎯 Sesi Fokus Berjalan' : '🎯 Siap Memulai Fokus'}</span>
            </div>

            <div className="text-6xl font-black font-mono tracking-tight text-stone-900 py-3">
              {formatTime(timeLeft)}
            </div>

            <p className="text-[11px] text-stone-400">
              {isBreak ? 'Tarik napas dan rileks sejenak.' : 'Jauhkan notifikasi sosmed & selesaikan target ini.'}
            </p>
          </div>

          {/* Target Info */}
          {subtask?.target_date && (
            <div className="bg-stone-100/80 rounded-xl p-3 text-center text-xs text-stone-600 font-mono">
              Target Penyelesaian: <span className="font-bold text-stone-900">{subtask.target_date}</span>
            </div>
          )}
        </div>

        {/* Floating Bottom Action Bar (Inspired by Right Mockup) */}
        <div className="absolute bottom-5 inset-x-0 flex justify-center px-6 pointer-events-none">
          <div className="pointer-events-auto bg-[#1A202C] text-white px-5 py-3 rounded-full flex items-center gap-4 shadow-float">
            
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold transition shadow-md active:scale-95 ${
                isActive ? 'bg-amber-500 text-white' : 'bg-[#F26A36] text-white'
              }`}
              title={isActive ? 'Jeda Timer' : 'Mulai Fokus'}
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Reset Timer */}
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-stone-700" />

            {/* Complete Checkmark Button */}
            <button
              onClick={() => {
                onComplete(subtask)
                onClose()
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition active:scale-95 shadow-sm"
              title="Tandai Selesai"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Selesai</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}
