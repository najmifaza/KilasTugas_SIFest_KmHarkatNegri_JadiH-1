import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ListChecks, Gauge, Timer, Share2, Sparkles } from "lucide-react";
import { KineticHeader } from "../components/KineticHeader";
import { theme } from "../theme";

export const Scene3_SolutionPillars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const philosophySpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14 },
  });

  const pillars = [
    {
      icon: ListChecks,
      title: "1. Actionable Chunking",
      desc: "Instruksi silabus panjang diurai otomatis menjadi 3–8 sub-tugas berurutan dengan kata kerja aktif dan estimasi 25–90 menit.",
      color: "orange",
      tag: "AI + Smart Cache",
    },
    {
      icon: Gauge,
      title: "2. Visual Micro-Pacing",
      desc: "Circular Progress Gauge & status dinamis On Track vs Behind Schedule agar mahasiswa tidak terjebak ilusi waktu luang semu.",
      color: "green",
      tag: "Real-time Pacing",
    },
    {
      icon: Timer,
      title: "3. Deep Focus Engine",
      desc: "Floating Pomodoro Timer 25/5 persisten, akurasi timestamp real-time, Web Audio API chime, dan countdown di tab browser.",
      color: "blue",
      tag: "Focus Execution",
    },
    {
      icon: Share2,
      title: "4. Blueprint & Calendar",
      desc: "Ekspor jadwal ke Google Calendar & .ics RFC 5545, serta fitur viral Blueprint Sharing (/p/:id) impor 1-klik untuk rekan sekelas.",
      color: "amber",
      tag: "Social Sync",
    },
  ];

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-14 relative overflow-hidden"
      style={{
        backgroundColor: theme.colors.bgWarm,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Header */}
      <KineticHeader
        badge="Solution & Innovation (Bobot 30%)"
        badgeColor="orange"
        title="Empat Pilar Solusi"
        highlight="KilasTugas"
        subtitle="Mentransformasi instruksi tugas abstrak menjadi eksekusi tindakan harian yang ringan dan terukur."
      />

      {/* Philosophy Banner */}
      <div
        style={{
          transform: `scale(${interpolate(philosophySpring, [0, 1], [0.95, 1])})`,
          opacity: philosophySpring,
        }}
        className="max-w-4xl mx-auto w-full bg-orange-600 text-white rounded-2xl p-4 shadow-md flex items-center gap-4 -mt-3 mb-2"
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm md:text-base font-semibold leading-relaxed">
          <span className="opacity-80 font-normal">Filosofi Inti: </span>
          &ldquo;Problem First, Technology Second: Jangan tanya &apos;kapan tugas harus selesai&apos;, tanyakan &apos;apa aksi konkret 30 menit yang dikerjakan hari ini&apos;.&rdquo;
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto w-full z-10">
        {pillars.map((p, idx) => {
          const itemSpring = spring({
            frame: frame - (12 + idx * 6),
            fps,
            config: { damping: 14 },
          });

          const IconComponent = p.icon;

          return (
            <div
              key={idx}
              style={{
                transform: `translateY(${interpolate(itemSpring, [0, 1], [30, 0])}px)`,
                opacity: itemSpring,
              }}
              className="bg-white/95 rounded-2xl border border-slate-200/90 p-5 shadow-lg flex gap-4 items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {p.title}
                  </h3>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {p.tag}
                  </span>
                </div>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
