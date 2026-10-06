import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Timer,
  Pause,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import { BrowserMockup } from "../components/BrowserMockup";
import { theme } from "../theme";

export const Scene5_FocusAndPacing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline events:
  // 0 - 35: Task list & top progress overview
  // 35 - 75: Floating Pomodoro timer pops up and ticks
  // 75+: Step 1 checked, progress circle rises from 0 to 20%

  const isTimerActive = frame >= 30;
  const isCompleted = frame >= 75;

  const timerPopSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 13, mass: 0.8 },
  });

  const completeSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 12 },
  });

  const progressPercent = isCompleted
    ? Math.round(interpolate(completeSpring, [0, 1], [0, 20]))
    : 0;

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-10 relative overflow-hidden"
      style={{
        backgroundColor: theme.colors.bgWarm,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
            Fitur Eksekusi Nyata • Solution &amp; Innovation (30%)
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Visual Micro-Pacing &amp; <span className="text-orange-600">Deep Focus Engine</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
          <Timer className="w-3.5 h-3.5 text-orange-600" />
          <span>Pomodoro 25/5 + Web Audio Chime</span>
        </div>
      </div>

      {/* Browser Mockup */}
      <BrowserMockup
        url="https://kilastugas.vercel.app"
        subtitle="Eksekusi Langkah Harian & Pomodoro Focus"
      >
        <div className="p-8 h-full flex flex-col justify-between relative">
          {/* Top Hero Progress Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Progress Ring Simulation */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#f1f5f9"
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#16a34a"
                    strokeWidth="5"
                    strokeDasharray={163}
                    strokeDashoffset={163 - (163 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-sm font-black text-slate-900">
                  {progressPercent}%
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Progres Keseluruhan Tugas
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    🟢 On Track
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {isCompleted
                    ? "1 dari 5 langkah selesai • Target harian terpenuhi!"
                    : "Target Hari Ini: Selesaikan 1 langkah awal (45 mnt)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-right">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">
                  Sisa Waktu
                </div>
                <div className="text-sm font-bold text-slate-800">5 Hari Menuju Deadline</div>
              </div>
            </div>
          </div>

          {/* Subtask 1 Focus Item */}
          <div className="my-4 space-y-3">
            <div
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isCompleted
                  ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                  : "bg-white border-orange-300 shadow-md ring-2 ring-orange-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : "border-2 border-slate-300 bg-white"
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-white" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                      Langkah 1
                    </span>
                    <h4
                      className={`text-sm font-bold ${
                        isCompleted
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      Hitung alokasi IP VLSM untuk 4 subnet
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tentukan prefix /27, /28, /29 dan tabel alamat broadcast.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  45 mnt
                </span>
                {!isCompleted && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs">
                    <Timer className="w-3.5 h-3.5" />
                    <span>Mulai Fokus</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subtask 2 preview */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-white/70 opacity-60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md border border-slate-200 bg-slate-50" />
                <span className="text-xs font-semibold text-slate-600">
                  Langkah 2: Rancang topologi di Packet Tracer &amp; konfigurasi OSPF
                </span>
              </div>
              <span className="text-xs text-slate-400">Besok • 60 mnt</span>
            </div>
          </div>

          {/* Floating Pomodoro Mini-Timer Bar (Sliding up from bottom) */}
          {isTimerActive && (
            <div
              style={{
                transform: `translateY(${interpolate(timerPopSpring, [0, 1], [60, 0])}px)`,
                opacity: timerPopSpring,
              }}
              className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 flex items-center justify-between z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/30 text-orange-400 flex items-center justify-center font-bold">
                  <Timer className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950 px-2 py-0.5 rounded">
                      Sesi Fokus Aktif
                    </span>
                    <span className="text-xs font-medium text-slate-300 truncate max-w-xs">
                      Hitung alokasi IP VLSM 4 subnet
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <Volume2 className="w-3 h-3 text-slate-400" />
                    <span>Audio Chime Synthesizer Siap</span>
                  </div>
                </div>
              </div>

              {/* Countdown Digits */}
              <div className="flex items-center gap-4">
                <div className="font-mono text-2xl font-black text-amber-300 tracking-wider bg-black/40 px-3 py-1 rounded-lg border border-slate-800">
                  {isCompleted ? "00:00" : "24:45"}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center">
                    <Pause className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </BrowserMockup>
    </div>
  );
};
