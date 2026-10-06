import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { GraduationCap, Code2, Globe } from "lucide-react";
import { theme } from "../theme";

export const Scene1_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const titleSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14 },
  });

  const subtitleSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15 },
  });

  const badgeSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12 },
  });

  const footerSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 16 },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between p-16 relative overflow-hidden"
      style={{
        backgroundColor: theme.colors.bgWarm,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Background Soft Accent Circles */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-200/40 blur-3xl pointer-events-none"
        style={{
          transform: `scale(${interpolate(frame, [0, 120], [0.8, 1.2])})`,
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-amber-200/40 blur-3xl pointer-events-none"
        style={{
          transform: `scale(${interpolate(frame, [0, 120], [1.1, 0.9])})`,
        }}
      />

      {/* Top Banner: SIFest 2026 */}
      <div
        style={{
          transform: `translateY(${interpolate(badgeSpring, [0, 1], [-20, 0])}px)`,
          opacity: badgeSpring,
        }}
        className="flex items-center gap-3 bg-white/90 backdrop-blur border border-orange-200/80 px-5 py-2 rounded-full shadow-sm"
      >
        <GraduationCap className="w-5 h-5 text-orange-600" />
        <span className="text-xs md:text-sm font-bold tracking-wider uppercase text-slate-800">
          SIFest Digital Innovation Challenge 2026 • Track Education
        </span>
      </div>

      {/* Center Hero: Logo & Title */}
      <div className="flex flex-col items-center text-center max-w-4xl z-10">
        {/* Logo Image */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
          className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-white p-3 shadow-xl border border-orange-100 flex items-center justify-center mb-6"
        >
          <Img
            src={staticFile("logo.png")}
            className="w-full h-full object-contain"
            alt="KilasTugas Logo"
          />
        </div>

        {/* Title */}
        <h1
          style={{
            transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
            opacity: titleSpring,
          }}
          className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-3"
        >
          Kilas<span className="text-orange-600">Tugas</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
            opacity: titleSpring,
          }}
          className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight"
        >
          Smart Actionable Task Breakdown & Micro-Pacing for Students
        </p>

        {/* Value Proposition Callout */}
        <div
          style={{
            transform: `translateY(${interpolate(subtitleSpring, [0, 1], [20, 0])}px)`,
            opacity: subtitleSpring,
          }}
          className="mt-6 px-6 py-3 rounded-2xl bg-white/95 border border-slate-200 shadow-md max-w-2xl"
        >
          <p className="text-slate-700 text-base md:text-lg italic font-medium leading-relaxed">
            &ldquo;Ubah Beban Tugas Kompleks Menjadi Aksi Harian yang Jelas, Ringan, dan Tereksekusi&rdquo;
          </p>
        </div>
      </div>

      {/* Footer Credentials */}
      <div
        style={{
          transform: `translateY(${interpolate(footerSpring, [0, 1], [20, 0])}px)`,
          opacity: footerSpring,
        }}
        className="w-full max-w-4xl flex items-center justify-between border-t border-orange-200/60 pt-5 text-sm text-slate-600"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">Tim KilasTugas</span>
          <span className="text-slate-400">•</span>
          <span>Universitas Jenderal Soedirman</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-slate-700">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            <span>kilastugas.vercel.app</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <Code2 className="w-3.5 h-3.5 text-slate-800" />
            <span>SIFest 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
