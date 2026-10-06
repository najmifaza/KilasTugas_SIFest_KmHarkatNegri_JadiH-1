import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  staticFile,
} from "remotion";
import { theme } from "../theme";

interface FloatingBadgeProps {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  delay?: number;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  themeColor?: "orange" | "emerald" | "blue" | "amber";
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  x,
  y,
  delay = 0,
  icon,
  title,
  subtitle,
  themeColor = "orange",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const colorStyles = {
    orange: "border-orange-300 bg-white/95 text-orange-950 shadow-orange-500/10",
    emerald: "border-emerald-300 bg-white/95 text-emerald-950 shadow-emerald-500/10",
    blue: "border-blue-300 bg-white/95 text-blue-950 shadow-blue-500/10",
    amber: "border-amber-300 bg-white/95 text-amber-950 shadow-amber-500/10",
  };

  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const translateY = interpolate(progress, [0, 1], [15, 0]);

  return (
    <>
      {/* Audio effect: bubble pop when badge appears */}
      {delay >= 0 && (
        <Sequence from={delay} durationInFrames={10}>
          <Audio src={staticFile("audio/pop.wav")} volume={0.35} />
        </Sequence>
      )}

      {frame >= delay && (
        <div
          className={`absolute z-40 rounded-2xl border px-4 py-2.5 shadow-xl backdrop-blur flex items-center gap-3 transition-transform ${colorStyles[themeColor]}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
            fontFamily: theme.fonts.sans,
          }}
        >
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <div>
            <div className="text-xs font-black tracking-tight uppercase leading-none">
              {title}
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                {subtitle}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
