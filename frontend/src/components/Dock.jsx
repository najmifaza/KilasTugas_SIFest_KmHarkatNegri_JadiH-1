import React from 'react'
import { Calendar, Layers, Home, Plus } from 'lucide-react'

export default function Dock({ activeTab, setActiveTab, onOpenCreate }) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-sm h-[68px] bg-white rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-slate-100 p-2 flex items-center justify-between px-3">
      {/* Tab 1: Hari Ini / Home */}
      <button
        type="button"
        onClick={() => setActiveTab('today')}
        className={`transition-all duration-200 cursor-pointer select-none active:scale-95 ${
          activeTab === 'today'
            ? 'w-[78px] h-[52px] rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center gap-0.5 shadow-xs'
            : 'min-w-[56px] h-[52px] flex flex-col items-center justify-center gap-0.5 text-[#71717A] hover:text-[#18181B]'
        }`}
      >
        <Home className="w-4 h-4" strokeWidth={activeTab === 'today' ? 2.25 : 1.75} />
        <span className="text-[10px] font-medium leading-none">Hari Ini</span>
      </button>

      {/* Tab 2: Jadwal / Calendar */}
      <button
        type="button"
        onClick={() => setActiveTab('schedule')}
        className={`transition-all duration-200 cursor-pointer select-none active:scale-95 ${
          activeTab === 'schedule'
            ? 'w-[78px] h-[52px] rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center gap-0.5 shadow-xs'
            : 'min-w-[56px] h-[52px] flex flex-col items-center justify-center gap-0.5 text-[#71717A] hover:text-[#18181B]'
        }`}
      >
        <Calendar className="w-4 h-4" strokeWidth={activeTab === 'schedule' ? 2.25 : 1.75} />
        <span className="text-[10px] font-medium leading-none">Jadwal</span>
      </button>

      {/* Center Primary Action: Big Plus Button */}
      <button
        type="button"
        onClick={onOpenCreate}
        className="w-12 h-12 rounded-full bg-[#18181B] text-white shadow-md shadow-black/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        title="Tambah Tugas Baru"
        aria-label="Tambah tugas baru"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Tab 3: Semua Tugas / Projects */}
      <button
        type="button"
        onClick={() => setActiveTab('all')}
        className={`transition-all duration-200 cursor-pointer select-none active:scale-95 ${
          activeTab === 'all'
            ? 'w-[78px] h-[52px] rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center gap-0.5 shadow-xs'
            : 'min-w-[56px] h-[52px] flex flex-col items-center justify-center gap-0.5 text-[#71717A] hover:text-[#18181B]'
        }`}
      >
        <Layers className="w-4 h-4" strokeWidth={activeTab === 'all' ? 2.25 : 1.75} />
        <span className="text-[10px] font-medium leading-none">Semua</span>
      </button>
    </nav>
  )
}
