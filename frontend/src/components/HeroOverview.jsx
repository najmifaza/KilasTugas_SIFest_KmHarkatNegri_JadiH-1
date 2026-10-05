import React from 'react'
import { Sparkles, ArrowUpRight, Layers, CheckCircle2, Clock } from 'lucide-react'

export default function HeroOverview({ tasks, onOpenCreate }) {
  const totalTasks = tasks.length
  // Hitung perkiraan langkah selesai jika ada
  const activeTasks = tasks.filter((t) => !t.is_completed)

  return (
    <div className="space-y-3.5 mb-5">
      {/* Hero Action Card (Identical to BEM-U Gradient Banner) */}
      <div
        onClick={onOpenCreate}
        className="relative overflow-hidden p-5 rounded-[1.5rem] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-sm border border-violet-400/30 transition-all duration-200 active:scale-[0.98] hover:shadow-md hover:shadow-violet-500/20 group cursor-pointer flex flex-col justify-between min-h-[140px]"
      >
        {/* Ambient Decorative Blurs */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-pink-500/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-violet-200 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>AI Micro-Pacing Engine</span>
            </div>
            <h2 className="font-black text-white text-xl sm:text-2xl tracking-tight leading-tight">
              Pecah Tugas Kuliah
            </h2>
          </div>
          <div className="p-2 rounded-full bg-white/15 text-white/90 group-hover:bg-white group-hover:text-violet-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0">
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-2 mt-2">
          <p className="text-xs text-violet-100 font-medium leading-relaxed max-w-[260px]">
            Hancurkan tugas menumpuk jadi aksi harian 25–45 menit.
          </p>
          <span className="text-[10px] font-bold text-violet-100 bg-white/20 px-2 py-0.5 rounded-full shrink-0 backdrop-blur-xs">
            + Tambah
          </span>
        </div>
      </div>

      {/* 3 Metric Summary Grid (Identical to BEM-U Homepage Grid) */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="bg-white border border-slate-200/90 rounded-[1.25rem] p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Tugas
            </span>
            <div className="p-1 rounded-lg bg-violet-50 text-violet-600">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 leading-none">
            {totalTasks}
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-[1.25rem] p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Aktif
            </span>
            <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 leading-none">
            {activeTasks.length}
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-[1.25rem] p-3 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Metode
            </span>
            <div className="p-1 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xs font-black text-slate-800 leading-none truncate">
            25m Pomodoro
          </div>
        </div>
      </div>
    </div>
  )
}
