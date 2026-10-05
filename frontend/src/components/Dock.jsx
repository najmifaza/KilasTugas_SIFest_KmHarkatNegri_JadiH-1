import React from 'react'
import { Calendar, Layers, Sparkles } from 'lucide-react'

export default function Dock({ activeTab, setActiveTab, onOpenCreate }) {
  return (
    <nav className="fixed bottom-0 md:bottom-6 left-0 md:left-1/2 md:-translate-x-1/2 right-0 md:right-auto z-40 bg-white/95 backdrop-blur-md border-t md:border border-slate-200/90 md:rounded-3xl pb-[env(safe-area-inset-bottom,0px)] md:pb-0 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:shadow-elevated md:w-96 transition-all duration-200">
      <div className="flex items-stretch max-w-md mx-auto w-full px-3 md:px-4 py-1 md:py-1.5">
        {/* Tab 1: Hari Ini */}
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-2.5 transition-colors duration-150 active:bg-slate-50 rounded-2xl ${
            activeTab === 'today' ? 'text-violet-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="w-5 h-5" strokeWidth={activeTab === 'today' ? 2.5 : 1.75} />
          <span className="text-[10px] font-bold leading-none tracking-tight">Hari Ini</span>
          {activeTab === 'today' && (
            <span className="absolute top-0 md:top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-violet-600 rounded-full" />
          )}
        </button>

        {/* Center Primary Action: Pecah Tugas AI (Floating highlight) */}
        <div className="flex-1 flex items-center justify-center -mt-5">
          <button
            type="button"
            onClick={onOpenCreate}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center border-2 border-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            title="Pecah Tugas Baru dengan AI"
          >
            <Sparkles className="w-5 h-5 fill-white text-white" />
          </button>
        </div>

        {/* Tab 2: Semua Tugas */}
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-2.5 transition-colors duration-150 active:bg-slate-50 rounded-2xl ${
            activeTab === 'all' ? 'text-violet-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Layers className="w-5 h-5" strokeWidth={activeTab === 'all' ? 2.5 : 1.75} />
          <span className="text-[10px] font-bold leading-none tracking-tight">Semua</span>
          {activeTab === 'all' && (
            <span className="absolute top-0 md:top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-violet-600 rounded-full" />
          )}
        </button>
      </div>
    </nav>
  )
}
