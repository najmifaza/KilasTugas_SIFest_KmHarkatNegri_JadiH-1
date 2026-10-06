import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface KineticHeaderProps {
  badge?: string;
  badgeColor?: "orange" | "blue" | "green" | "amber";
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const KineticHeader: React.FC<KineticHeaderProps> = ({
  badge,
  badgeColor = "orange",
  title,
  highlight,
  subtitle,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const badgeProgress = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12 },
  });

  const subtitleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15 },
  });

  const badgeColorMap = {
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
  };

  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col ${isCenter ? "items-center text-center" : "items-start text-left"} mb-8`}
      style={{ fontFamily: theme.fonts.sans }}
    >
      {badge && (
        <div
          style={{
            transform: `scale(${badgeProgress}) translateY(${interpolate(badgeProgress, [0, 1], [-12, 0])}px)`,
            opacity: badgeProgress,
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-xs mb-3 ${badgeColorMap[badgeColor]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {badge}
        </div>
      )}

      <h2
        style={{
          transform: `translateY(${interpolate(titleProgress, [0, 1], [24, 0])}px)`,
          opacity: titleProgress,
        }}
        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
      >
        {title}{" "}
        {highlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p
          style={{
            transform: `translateY(${interpolate(subtitleProgress, [0, 1], [16, 0])}px)`,
            opacity: subtitleProgress,
          }}
          className="text-slate-600 text-lg md:text-xl font-normal mt-2.5 max-w-3xl leading-relaxed"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
