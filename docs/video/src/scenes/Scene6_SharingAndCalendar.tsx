import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Calendar,
  Share2,
  Copy,
  Download,
  Users,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { BrowserMockup } from "../components/BrowserMockup";
import { theme } from "../theme";

export const Scene6_SharingAndCalendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modalSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14 },
  });

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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
            Fitur Kolaborasi &amp; Kalender • Solution (30%)
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Ekspor Kalender &amp; <span className="text-orange-600">Task Blueprint Sharing (/p/:id)</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
          <Share2 className="w-3.5 h-3.5 text-amber-600" />
          <span>1-Click Import Antar Mahasiswa</span>
        </div>
      </div>

      {/* Browser Screen Mockup */}
      <BrowserMockup
        url="https://kilastugas.vercel.app/p/jarkom-ospf-2026"
        subtitle="Berbagi Cetak Biru Tugas ke Rekan Seangkatan"
      >
        <div className="p-8 h-full flex items-center justify-center relative">
          {/* Main Card with Calendar Actions */}
          <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 p-7 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
            {/* Left: Calendar Integrations */}
            <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pr-0 md:pr-6 pb-6 md:pb-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Sinkronisasi Kalender
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Sub-tugas harian terhubung langsung ke agenda digital mahasiswa dengan alarm otomatis 15 menit sebelum waktu pengerjaan.
                </p>

                <div className="space-y-3">
                  <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                      <span>Buka Langsung di Google Calendar</span>
                    </div>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                      App Intent
                    </span>
                  </div>

                  <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>Unduh Berkas Standar .ics</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                      RFC 5545
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Barrier Guest Mode (Dual-layer sync LocalStorage &amp; MariaDB)</span>
              </div>
            </div>

            {/* Right: Blueprint Sharing Modal Preview */}
            <div
              style={{
                transform: `scale(${interpolate(modalSpring, [0, 1], [0.95, 1])})`,
                opacity: modalSpring,
              }}
              className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    <span>Cetak Biru Tugas Bersama</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">5 Sub-Tugas</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Laporan Routing OSPF &amp; VLSM
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Dibagikan oleh rekan sekelas untuk jadwal kerja praktikum terkoordinasi.
                </p>

                {/* Shareable Link Box */}
                <div className="bg-white border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono text-slate-700 mb-4">
                  <span className="truncate max-w-[200px]">
                    https://kilastugas.vercel.app/p/jarkom-ospf-2026
                  </span>
                  <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded cursor-pointer">
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Import CTA */}
              <div className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold text-xs text-center shadow-md flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" />
                <span>Impor ke Jadwal Saya (1-Detik Selesai)</span>
              </div>
            </div>
          </div>
        </div>
      </BrowserMockup>
    </div>
  );
};
