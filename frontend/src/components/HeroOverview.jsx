import React from 'react'

export default function HeroOverview({ tasks }) {
  const isTaskCompleted = (t) => {
    if (!t) return false
    if (t.is_completed) return true
    if (t.subtasks_total > 0 && t.subtasks_done >= t.subtasks_total) return true
    if (t.progress_percent === 100) return true
    return false
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(isTaskCompleted)
  const activeTasks = tasks.filter((t) => !isTaskCompleted(t))

  // Calculate micro-pacing progress accurately from subtasks or tasks
  const totalSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks_total || 0), 0)
  const completedSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks_done || 0), 0)

  let percent = 0
  if (totalSubtasks > 0) {
    percent = Math.round((completedSubtasks / totalSubtasks) * 100)
  } else if (totalTasks > 0) {
    percent = Math.round((completedTasks.length / totalTasks) * 100)
  }

  const progressRatio = percent / 100

  // SVG Gauge measurements
  const size = 130
  const stroke = 13
  const radius = (size - stroke) / 2 // 58.5
  const circ = 2 * Math.PI * radius // ~367.57
  const strokeDashoffset = circ * (1 - progressRatio)

  // Knob coordinates at end of arc (clockwise from 12 o'clock / -90deg)
  const angleDeg = -90 + progressRatio * 360
  const angleRad = (angleDeg * Math.PI) / 180
  const knobX = size / 2 + radius * Math.cos(angleRad)
  const knobY = size / 2 + radius * Math.sin(angleRad)

  const stats = [
    { count: totalTasks, label: 'Total Tugas' },
    { count: completedTasks.length, label: 'Tugas Selesai' },
    { count: activeTasks.length, label: 'Tugas Berjalan' },
  ]

  return (
    <div className="w-full rounded-[32px] bg-[#202023] p-5 sm:p-6 shadow-2xl relative overflow-hidden mb-5 border border-white/5">
      {/* Subtle top-left radial glow highlight */}
      <div className="absolute -left-12 -top-12 w-44 h-44 bg-zinc-700/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Section: Header + Gauge */}
        <div className="flex flex-col shrink-0">
          <span className="mb-2.5 text-[15px] sm:text-[16px] font-semibold text-white tracking-tight">
            Today's Progress
          </span>

          <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <svg
              width={size}
              height={size}
              className="overflow-visible"
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Base White Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#FFFFFF"
                strokeWidth={stroke}
                fill="none"
              />

              {/* Lime Green Progress Arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#C5DC69"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                fill="none"
                className="transition-all duration-700 ease-out"
              />

              {/* End Knob (always visible at progress tip or starting 12 o'clock) */}
              <circle
                cx={knobX}
                cy={knobY}
                r={7.5}
                fill="#C5DC69"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth={2}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Center Percentage Display */}
            <div className="absolute inset-0 flex items-center justify-center select-none">
              <span className="text-[26px] sm:text-[28px] font-bold text-white leading-none">
                {percent}
              </span>
              <span className="text-[15px] sm:text-[16px] font-medium text-white leading-none ml-0.5">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-[120px] w-[1px] bg-white/15 shrink-0 mx-2 sm:mx-4" />

        {/* Right Section: 3 Stat Rows with Icon Plate */}
        <div className="flex-1 flex flex-col justify-center gap-3.5 min-w-0">
          {stats.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {/* Circular Icon Container (38px x 38px) */}
              <div className="w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] rounded-full bg-white/[0.08] flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D1D1D6"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="m9 14 2 2 4-4" />
                </svg>
              </div>

              {/* Text Stack: Count on top, Label below */}
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[15px] font-bold text-white tracking-tight leading-snug">
                  {s.count}
                </span>
                <span className="text-[12px] font-normal text-[#8E8E93] leading-snug truncate">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
