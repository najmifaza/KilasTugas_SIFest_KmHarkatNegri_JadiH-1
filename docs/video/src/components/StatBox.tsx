import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface StatBoxProps {
  delay?: number;
  value: string;
  label: string;
  source: string;
  accent?: "orange" | "blue" | "green" | "rose";
}

export const StatBox: React.FC<StatBoxProps> = ({
  delay = 0,
  value,
  label,
  source,
  accent = "orange",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  const borderColors = {
    orange: "border-orange-200 bg-orange-50/40 text-orange-600",
    blue: "border-blue-200 bg-blue-50/40 text-blue-600",
    green: "border-emerald-200 bg-emerald-50/40 text-emerald-600",
    rose: "border-rose-200 bg-rose-50/40 text-rose-600",
  };

  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        fontFamily: theme.fonts.sans,
      }}
      className={`flex-1 rounded-2xl border p-6 bg-white shadow-lg transition-all flex flex-col justify-between ${borderColors[accent]}`}
    >
      <div>
        <div className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-slate-900">
          {value}
        </div>
        <p className="text-slate-700 text-sm md:text-base font-medium leading-snug">
          {label}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Validasi
        </span>
        <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {source}
        </span>
      </div>
    </div>
  );
};
