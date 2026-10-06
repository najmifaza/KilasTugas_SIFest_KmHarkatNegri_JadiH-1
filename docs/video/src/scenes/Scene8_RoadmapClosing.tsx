import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import {
  FileText,
  Users,
  WifiOff,
  CheckCircle2,
  Globe,
  Code2,
} from "lucide-react";
import { KineticHeader } from "../components/KineticHeader";
import { theme } from "../theme";

export const Scene8_RoadmapClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const roadmapSpring = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const closingSpring = spring({ frame: frame - 25, fps, config: { damping: 13 } });

  const roadmapItems = [
    {
      icon: FileText,
      title: "AI Syllabus & PDF Reader",
      desc: "Ekstraksi instruksi otomatis dari berkas silabus modul PDF/DOCX dosen.",
      tag: "Grand Final Sprint",
    },
    {
      icon: Users,
      title: "Collaborative Group Task Split",
      desc: "Pembagian porsi sub-tugas harian merata untuk tugas kelompok (anti free-rider).",
      tag: "Grand Final Sprint",
    },
    {
      icon: WifiOff,
      title: "Offline-First PWA & Push Alert",
      desc: "Akses tanpa kuota via IndexedDB dan notifikasi push saat peramban ditutup.",
      tag: "Grand Final Sprint",
    },
  ];

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-12 relative overflow-hidden"
      style={{
        backgroundColor: theme.colors.bgWarm,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Header */}
      <KineticHeader
        badge="Roadmap & Grand Final Sprint (Guidebook Bab 7.1)"
        badgeColor="orange"
        title="Kesiapan MVP &amp;"
        highlight="Roadmap Pengembangan"
        subtitle="MVP saat ini siap digunakan (50% dari total visi), dengan fitur lanjutan disiapkan untuk tahap Grand Final."
      />

      {/* 3 Roadmap Cards */}
      <div
        style={{
          transform: `translateY(${interpolate(roadmapSpring, [0, 1], [30, 0])}px)`,
          opacity: roadmapSpring,
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto w-full z-10"
      >
        {roadmapItems.map((item, i) => {
          const IconComponent = item.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terjadwal Grand Final</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Big Closing Banner */}
      <div
        style={{
          transform: `translateY(${interpolate(closingSpring, [0, 1], [30, 0])}px)`,
          opacity: closingSpring,
        }}
        className="max-w-5xl mx-auto w-full bg-white rounded-3xl border border-orange-200 p-6 shadow-xl flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-orange-100 shadow-md flex items-center justify-center shrink-0">
            <Img
              src={staticFile("logo.png")}
              className="w-full h-full object-contain"
              alt="KilasTugas Logo"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Kilas<span className="text-orange-600">Tugas</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">• Tim KilasTugas</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                Universitas Jenderal Soedirman
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 italic font-medium">
              &ldquo;Eliminasi Task Paralysis, Wujudkan Aksi Nyata.&rdquo;
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-800 border border-orange-200 px-3.5 py-1.5 rounded-xl font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>kilastugas.vercel.app</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl font-semibold">
            <Code2 className="w-3.5 h-3.5 text-slate-300" />
            <span>SIFest 2026 Innovation Challenge</span>
          </div>
        </div>
      </div>
    </div>
  );
};
