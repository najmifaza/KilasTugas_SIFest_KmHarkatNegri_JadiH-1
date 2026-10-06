import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ban } from "lucide-react";
import { KineticHeader } from "../components/KineticHeader";
import { StatBox } from "../components/StatBox";
import { theme } from "../theme";

export const Scene2_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bannerSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15 },
  });

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-14 relative overflow-hidden"
      style={{
        backgroundColor: theme.colors.bgWarm,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />

      {/* Header */}
      <KineticHeader
        badge="Problem Identification & Validation (Bobot 40%)"
        badgeColor="orange"
        title="Beban Modul Tebal Memicu"
        highlight="Task Paralysis"
        subtitle="Mahasiswa bukan malas, melainkan mengalami cognitive overload saat menerima instruksi tugas belasan halaman tanpa panduan titik awal tindakan."
      />

      {/* 3 Empirical Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full z-10">
        <StatBox
          delay={10}
          value="78,6%"
          label="Mahasiswa sering/selalu mengerjakan tugas di malam H-1 / H-0 deadline."
          source="Survei 28 Mahasiswa S&T"
          accent="rose"
        />
        <StatBox
          delay={18}
          value="64,3%"
          label='Alasan utama menunda: "Bingung mulai dari mana & kewalahan membaca instruksi".'
          source="Validasi Empiris Lapangan"
          accent="orange"
        />
        <StatBox
          delay={26}
          value="80%–95%"
          label="Mahasiswa perguruan tinggi terdampak prokrastinasi akademik kronis."
          source="APA / Onwuegbuzie & Jiao"
          accent="blue"
        />
      </div>

      {/* Gap Analysis Box */}
      <div
        style={{
          transform: `translateY(${interpolate(bannerSpring, [0, 1], [25, 0])}px)`,
          opacity: bannerSpring,
        }}
        className="max-w-5xl mx-auto w-full bg-white/95 rounded-2xl border border-rose-200 p-5 shadow-lg flex items-center gap-5 z-10"
      >
        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <Ban className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Kelemahan To-Do List Biasa
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Notion / Google Keep / Todoist
            </span>
          </div>
          <p className="text-slate-800 text-sm md:text-base font-medium">
            Hanya bersifat <span className="font-bold text-rose-700">deadline-centric</span> (mencatat tanggal mati), bukan <span className="font-bold text-emerald-700">action-centric</span>. Beban pemecahan langkah kerja diserahkan 100% pada mahasiswa yang sedang kewalahan.
          </p>
        </div>
      </div>
    </div>
  );
};
