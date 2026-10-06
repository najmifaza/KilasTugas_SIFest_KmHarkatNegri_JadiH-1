import React from "react";
import { Img, staticFile } from "remotion";
import { Lock } from "lucide-react";
import { theme } from "../theme";

interface CinematicScreenViewProps {
  imageSrc: string;
  scale?: number;
  originX?: number; // 0 to 100%
  originY?: number; // 0 to 100%
  rotateX?: number;
  rotateY?: number;
  children?: React.ReactNode;
}

export const CinematicScreenView: React.FC<CinematicScreenViewProps> = ({
  imageSrc,
  scale = 1,
  originX = 50,
  originY = 50,
  rotateX = 0,
  rotateY = 0,
  children,
}) => {
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        perspective: 1400,
        backgroundColor: theme.colors.bgWarm,
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-orange-200/30 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* 3D Moving Browser Canvas */}
      <div
        className="w-[1600px] h-[920px] rounded-2xl bg-white border border-slate-300 shadow-2xl overflow-hidden flex flex-col relative transition-transform"
        style={{
          transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Real Browser Chrome Top Bar */}
        <div className="h-11 bg-slate-100/95 border-b border-slate-200/90 px-4 flex items-center justify-between shrink-0 select-none z-30">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20" />
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-1 text-xs font-mono text-slate-700 shadow-2xs">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">https://</span>
            <span className="text-slate-900 font-medium">kilastugas.vercel.app</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live App Production
          </div>
        </div>

        {/* Real Screen Image with Dynamic Camera Zoom/Pan */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#fcece3]">
          <div
            className="w-full h-full absolute inset-0 origin-center transition-transform"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${originX}% ${originY}%`,
            }}
          >
            <Img
              src={staticFile(imageSrc)}
              className="w-full h-full object-cover object-top"
              alt="Real Application Screen"
            />
          </div>

          {/* Overlay elements (Cursor, Callout badges, Spotlights) */}
          <div className="absolute inset-0 pointer-events-none z-40">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
