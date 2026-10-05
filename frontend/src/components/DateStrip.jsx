import React from 'react'

export default function DateStrip({ selectedDate, onSelectDate }) {
  // Generate days around today (-2 to +4 days)
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  for (let i = -2; i <= 4; i++) {
    const d = new Date()
    d.setDate(today.getDate() + i)
    d.setHours(0, 0, 0, 0)
    days.push(d)
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 px-0.5 scrollbar-none no-scrollbar w-full max-w-full">
      {days.map((date, idx) => {
        // If selectedDate is null, today is active by default
        const active = selectedDate ? isSameDay(date, selectedDate) : isSameDay(date, today)
        const dayName = DAY_NAMES[date.getDay()]
        const dayNum = date.getDate()

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectDate(isSameDay(date, selectedDate) ? null : date)}
            className={`w-[44px] sm:w-[50px] h-[72px] sm:h-[76px] rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-200 shrink-0 cursor-pointer select-none active:scale-95 ${
              active
                ? 'bg-[#111113] text-white shadow-lg shadow-black/15'
                : 'bg-white/60 hover:bg-white/80 backdrop-blur-md text-slate-800 border border-white/80 shadow-2xs'
            }`}
          >
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                active ? 'text-zinc-400' : 'text-slate-400'
              }`}
            >
              {dayName}
            </span>
            <span
              className={`text-base sm:text-lg font-bold font-mono leading-none ${
                active ? 'text-white' : 'text-slate-900'
              }`}
            >
              {dayNum}
            </span>
          </button>
        )
      })}
    </div>
  )
}
