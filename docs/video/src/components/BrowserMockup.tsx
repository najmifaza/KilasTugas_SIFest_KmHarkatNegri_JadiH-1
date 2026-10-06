import React from "react";
import { Lock, Monitor } from "lucide-react";
import { theme } from "../theme";

interface BrowserMockupProps {
  url?: string;
  children: React.ReactNode;
  subtitle?: string;
  device?: "desktop" | "mobile";
  className?: string;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  url = "https://kilastugas.vercel.app",
  children,
  subtitle,
  device = "desktop",
  className = "",
}) => {
  if (device === "mobile") {
    return (
      <div
        className={`w-[440px] rounded-[44px] border-[10px] border-slate-900 bg-white shadow-2xl overflow-hidden flex flex-col ${className}`}
        style={{ fontFamily: theme.fonts.sans }}
      >
        {/* Dynamic Island / Speaker */}
        <div className="bg-slate-900 pt-3 pb-2 flex justify-center items-center">
          <div className="w-28 h-5 bg-black rounded-full flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
          </div>
        </div>
        {/* Mobile Header URL */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span className="truncate">{url.replace("https://", "")}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
            Mobile MVP
          </span>
        </div>
        {/* Screen Content */}
        <div className="flex-1 overflow-hidden bg-[#fcece3] relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-[1560px] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col ${className}`}
      style={{ fontFamily: theme.fonts.sans }}
    >
      {/* Browser Bar */}
      <div className="bg-slate-100/90 backdrop-blur px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        {/* Traffic Lights */}
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-rose-500/30" />
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500/30" />
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-500/30" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl mx-6 bg-white border border-slate-200 rounded-lg px-3.5 py-1.5 flex items-center justify-between text-sm shadow-xs">
          <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">https://</span>
            <span className="text-slate-900 font-medium">
              {url.replace("https://", "")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live MVP
          </div>
        </div>

        {/* Device indicator & subtitle */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {subtitle && (
            <span className="hidden md:inline-block font-medium text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-md">
              {subtitle}
            </span>
          )}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-1">
            <Monitor className="w-3.5 h-3.5 text-slate-700" />
          </div>
        </div>
      </div>

      {/* Screen Viewport */}
      <div className="flex-1 overflow-hidden bg-[#fcece3] relative min-h-[700px]">
        {children}
      </div>
    </div>
  );
};
