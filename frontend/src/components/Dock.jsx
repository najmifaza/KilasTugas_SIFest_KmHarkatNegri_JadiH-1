import React from 'react'
import { CheckSquare, Sparkles, Calendar, Layers } from 'lucide-react'

export default function Dock({ activeTab, setActiveTab, onOpenCreate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-stretch max-w-md mx-auto w-full px-2">
        {/* Tab 1: Hari Ini */}
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 pt-2.5 pb-3 transition-colors duration-150 active:bg-slate-50 ${
            activeTab === 'today' ? 'text-violet-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="w-5 h-5" strokeWidth={activeTab === 'today' ? 2.5 : 1.75} />
          <span className="text-[10px] font-bold leading-none tracking-tight">Hari Ini</span>
          {activeTab === 'today' && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-violet-600 rounded-full" />
          )}
        </button>

        {/* Center Primary Action: Pecah Tugas AI (Floating highlight) */}
        <div className="flex-1 flex items-center justify-center -mt-4">
          <button
            type="button"
            onClick={onOpenCreate}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center border-2 border-white transition-all duration-200 hover:scale-105 active:scale-95"
            title="Pecah Tugas Baru dengan AI"
          >
            <Sparkles className="w-5 h-5 fill-white text-white" />
          </button>
        </div>

        {/* Tab 2: Semua Tugas */}
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 pt-2.5 pb-3 transition-colors duration-150 active:bg-slate-50 ${
            activeTab === 'all' ? 'text-violet-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Layers className="w-5 h-5" strokeWidth={activeTab === 'all' ? 2.5 : 1.75} />
          <span className="text-[10px] font-bold leading-none tracking-tight">Semua</span>
          {activeTab === 'all' && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-violet-600 rounded-full" />
          )}
        </button>
      </div>
    </nav>
  )
}
