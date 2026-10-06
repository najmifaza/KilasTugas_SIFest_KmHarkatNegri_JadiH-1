import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Sparkles,
  Clock,
  Calendar,
} from "lucide-react";
import { BrowserMockup } from "../components/BrowserMockup";
import { theme } from "../theme";

export const Scene4_WalkthroughInput: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stage timeline
  // 0 - 30: Modal form shown with filled inputs
  // 30 - 55: Click button + AI loading spinner
  // 55+: Subtasks revealed one by one

  const isFormPhase = frame < 40;
  const isLoadingPhase = frame >= 40 && frame < 70;
  const isResultPhase = frame >= 70;

  const formSpring = spring({
    frame,
    fps,
    config: { damping: 14 },
  });

  const buttonClickSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 8, mass: 0.5 },
  });

  const subtasks = [
    {
      step: 1,
      title: "Hitung alokasi IP VLSM untuk 4 subnet",
      desc: "Tentukan prefix /27, /28, /29 dan tabel alamat broadcast.",
      dur: "45 mnt",
      day: "Hari Ini (Offset 0)",
      accent: "border-orange-200 bg-orange-50/30",
    },
    {
      step: 2,
      title: "Rancang topologi di Packet Tracer & konfigurasi OSPF",
      desc: "Hubungkan 3 router 2911, masukkan perintah router ospf 1.",
      dur: "60 mnt",
      day: "Besok (Offset +1)",
      accent: "border-slate-200 bg-white",
    },
    {
      step: 3,
      title: "Uji ping antar host & catat tabel routing CLI",
      desc: "Simulasikan kegagalan link kabel dan rekam output terminal.",
      dur: "45 mnt",
      day: "H+2 (Offset +2)",
      accent: "border-slate-200 bg-white",
    },
    {
      step: 4,
      title: "Tulis bab pembahasan analisis performa OSPF",
      desc: "Bandingkan metrik konvergensi routing dinamis vs statis.",
      dur: "60 mnt",
      day: "H+3 (Offset +3)",
      accent: "border-slate-200 bg-white",
    },
    {
      step: 5,
      title: "Finalisasi format laporan & ekspor ke PDF",
      desc: "Cek pedoman margin, daftar pustaka IEEE, dan export PDF.",
      dur: "30 mnt",
      day: "H+4 (Offset +4)",
      accent: "border-slate-200 bg-white",
    },
  ];

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
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full">
            Live MVP Walkthrough • User Experience (10%)
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Input Tugas &amp; AI Breakdown <span className="text-orange-600">Instan (&lt;2 Detik)</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs font-mono text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
          <span>9Router Gemini AI + Smart Cache</span>
        </div>
      </div>

      {/* Browser Screen Mockup */}
      <BrowserMockup
        url="https://kilastugas.vercel.app"
        subtitle="Alur Penguraian Tugas Mahasiswa"
      >
        <div className="p-8 h-full flex items-center justify-center">
          {/* Phase 1 & 2: Modal Input Form */}
          {(isFormPhase || isLoadingPhase) && (
            <div
              style={{
                transform: `scale(${interpolate(formSpring, [0, 1], [0.92, 1])})`,
                opacity: formSpring,
              }}
              className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-7 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    +
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Tambah Tugas Baru
                    </h3>
                    <p className="text-xs text-slate-500">
                      AI memecah silabus tugas menjadi aksi harian terukur
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                  Praktikum Lab
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Tugas
                  </label>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800">
                    Laporan Akhir Routing Dinamis OSPF &amp; VLSM
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mata Kuliah
                    </label>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800">
                      Jaringan Komputer
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Batas Waktu (Deadline)
                    </label>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 flex items-center justify-between">
                      <span>Jumat, 10 Okt (5 Hari Lagi)</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instruksi Tugas / Silabus Dosen
                  </label>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed font-mono">
                    &quot;Susun laporan praktikum 5 bab: topologi jaringan, subnetting VLSM 4 subnet, routing OSPF Packet Tracer, pengujian ping, dan analisis konvergensi.&quot;
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <div
                    style={{
                      transform: isFormPhase
                        ? `scale(${interpolate(buttonClickSpring, [0, 1], [1, 0.96])})`
                        : "scale(1)",
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                      isLoadingPhase
                        ? "bg-slate-900 text-white"
                        : "bg-orange-600 text-white hover:bg-orange-700"
                    }`}
                  >
                    {isLoadingPhase ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Mengurai Instruksi dengan AI &amp; Smart Cache...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Pecah Tugas Jadi Aksi Harian (5 Langkah)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Breakdown Result (5 Subtasks) */}
          {isResultPhase && (
            <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Laporan Akhir Routing Dinamis OSPF &amp; VLSM
                    </h3>
                    <p className="text-xs text-slate-500">
                      5 Sub-Tugas Harian Terstruktur • Target Selesai H-1 Deadline
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    🟢 On Track
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    Resp: 1.2s
                  </span>
                </div>
              </div>

              {/* Subtask Cards List */}
              <div className="space-y-2.5">
                {subtasks.map((st, i) => {
                  const itemSpring = spring({
                    frame: frame - (70 + i * 8),
                    fps,
                    config: { damping: 14 },
                  });

                  return (
                    <div
                      key={st.step}
                      style={{
                        transform: `translateY(${interpolate(itemSpring, [0, 1], [20, 0])}px)`,
                        opacity: itemSpring,
                      }}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between shadow-2xs ${st.accent}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {st.step}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {st.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-tight">
                            {st.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {st.dur}
                        </span>
                        <span className="text-xs font-medium text-orange-700 bg-orange-100/70 px-2.5 py-1 rounded-lg">
                          {st.day}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </BrowserMockup>
    </div>
  );
};
