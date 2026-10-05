import React from 'react'
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react'

export default function HeroOverview({ tasks }) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.is_completed)
  const activeTasks = tasks.filter((t) => !t.is_completed)

  const percent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  // SVG circular gauge math: r = 40 -> circumference = 2 * PI * 40 ≈ 251.33
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <div className="bg-[#1E1E22] text-white rounded-[32px] p-5 sm:p-6 shadow-2xl relative overflow-hidden mb-5 border border-zinc-800/80">
      {/* Subtle top-left radial glow highlight */}
      <div className="absolute -left-12 -top-12 w-44 h-44 bg-zinc-700/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header inside card (Reference: "Today's Progress") */}
      <div className="relative z-10 mb-2">
        <h2 className="text-[15px] font-medium text-white tracking-tight">
          Progres Hari Ini
        </h2>
      </div>

      {/* Main Split Layout: Gauge + Vertical Divider + 3 Stat Rows */}
      <div className="relative z-10 flex items-center justify-between sm:justify-start sm:gap-6 pt-1">
        {/* Left: Circular Progress Ring (104px diameter) */}
        <div className="relative w-[104px] h-[104px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            {/* Background Track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="#2E2E33"
              strokeWidth="9"
            />
            {/* Foreground Active Ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="#C7F263"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ filter: 'drop-shadow(0 0 6px rgba(199, 242, 99, 0.4))' }}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-white tracking-tight">
              {percent}
            </span>
            <span className="text-sm font-medium text-white ml-0.5 mt-0.5">
              %
            </span>
          </div>
        </div>

        {/* Center: Vertical Divider Line */}
        <div className="w-px h-28 bg-white/10 shrink-0 mx-2 sm:mx-4" />

        {/* Right: 3 Stat Rows with Circular Icon Plate */}
        <div className="flex-1 space-y-3 min-w-0">
          {/* Row 1: Total Tasks */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ClipboardList className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-white leading-tight block">
                {totalTasks}
              </span>
              <span className="text-[11px] font-normal text-[#A1A1AA] leading-tight block">
                Total Tugas
              </span>
            </div>
          </div>

          {/* Row 2: Completed Tasks */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F263]" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-white leading-tight block">
                {completedTasks.length}
              </span>
              <span className="text-[11px] font-normal text-[#A1A1AA] leading-tight block">
                Tugas Selesai
              </span>
            </div>
          </div>

          {/* Row 3: Active / Pending Tasks */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-white leading-tight block">
                {activeTasks.length}
              </span>
              <span className="text-[11px] font-normal text-[#A1A1AA] leading-tight block">
                Tugas Berjalan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
