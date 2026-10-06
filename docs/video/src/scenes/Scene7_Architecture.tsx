import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Server, Database, Cpu, Zap, ShieldAlert, ArrowRight } from "lucide-react";
import { KineticHeader } from "../components/KineticHeader";
import { theme } from "../theme";

export const Scene7_Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clientSpring = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const backendSpring = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const aiSpring = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const featureSpring = spring({ frame: frame - 35, fps, config: { damping: 15 } });

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
        badge="Technical Implementation (Bobot 10%)"
        badgeColor="blue"
        title="Arsitektur Sistem &amp;"
        highlight="Zero-Downtime Reliability"
        subtitle="Dirancang untuk efisiensi komputasi tinggi, biaya operasional hemat token, dan keandalan operasional daring."
      />

      {/* 3-Tier Architecture Flow */}
      <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto w-full z-10">
        {/* Tier 1: Client */}
        <div
          style={{
            transform: `translateY(${interpolate(clientSpring, [0, 1], [30, 0])}px)`,
            opacity: clientSpring,
          }}
          className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Frontend Layer
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              React 18 + Vite 5 + Tailwind
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              SPA responsif mobile &amp; desktop. Bundle size ultra-ringan &lt;90KB gzip, di-host pada Vercel Global Edge.
            </p>
          </div>
          <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-max">
            kilastugas.vercel.app
          </span>
        </div>

        <ArrowRight className="w-6 h-6 text-slate-400 shrink-0" />

        {/* Tier 2: Backend */}
        <div
          style={{
            transform: `translateY(${interpolate(backendSpring, [0, 1], [30, 0])}px)`,
            opacity: backendSpring,
          }}
          className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Backend Engine
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              FastAPI Python 3.12 Async
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Validasi skema Pydantic v2, endpoint asinkronus, Nginx reverse proxy dengan sertifikat SSL Let&apos;s Encrypt.
            </p>
          </div>
          <span className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded w-max">
            api-kilastugas.najmifaza.my.id
          </span>
        </div>

        <ArrowRight className="w-6 h-6 text-slate-400 shrink-0" />

        {/* Tier 3: AI & Database */}
        <div
          style={{
            transform: `translateY(${interpolate(aiSpring, [0, 1], [30, 0])}px)`,
            opacity: aiSpring,
          }}
          className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Persistence &amp; AI
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              MariaDB + 9Router AI
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Koneksi pooling MariaDB relasional dan gateway 9Router port 20128 (gemini-3.7-flash-medium).
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-max">
            MariaDB 10.x RDBMS
          </span>
        </div>
      </div>

      {/* Two Critical Reliability Highlights */}
      <div
        style={{
          transform: `translateY(${interpolate(featureSpring, [0, 1], [25, 0])}px)`,
          opacity: featureSpring,
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto w-full z-10"
      >
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-md flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-sm font-bold text-slate-900">
                Smart Caching Engine
              </h4>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                &lt;20ms Latency
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Jika tugas serupa pernah dipecah rekan lain, sistem menyajikan cetak biru instan tanpa memakan kuota token AI.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-md flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-sm font-bold text-slate-900">
                Deterministic Fallback (Zero-Downtime)
              </h4>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                High Availability
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Jika koneksi AI terganggu, sistem otomatis beralih ke kurasi template kurikulum bawaan. Aplikasi tetap berjalan 100%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
