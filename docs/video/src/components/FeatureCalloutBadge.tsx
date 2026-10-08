import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Zap,
  Sparkles,
  CheckCircle2,
  Timer,
  Calendar,
  PartyPopper,
  Compass,
  Rocket,
} from "lucide-react";
import { FEATURES, FeatureHighlight } from "../timelineData";

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Zap,
  Sparkles,
  CheckCircle2,
  Timer,
  Calendar,
  PartyPopper,
  Compass,
  Rocket,
};

const BADGE_COLORS = {
  orange: {
    bg: "#fff7ed",
    text: "#c2410c",
    pillBg: "#ea580c",
  },
  green: {
    bg: "#f0fdf4",
    text: "#15803d",
    pillBg: "#16a34a",
  },
  blue: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    pillBg: "#2563eb",
  },
  purple: {
    bg: "#faf5ff",
    text: "#7e22ce",
    pillBg: "#9333ea",
  },
};

export const FeatureCalloutBadge: React.FC = () => {
  const frame = useCurrentFrame();

  // Hide during full-screen roadmap and outro sections to avoid clutter
  if (frame >= 5610) return null;

  const activeFeature: FeatureHighlight | undefined = FEATURES.find(
    (feat) => frame >= feat.startFrame && frame < feat.endFrame
  );

  if (!activeFeature) return null;

  const localFrame = frame - activeFeature.startFrame;
  const duration = activeFeature.endFrame - activeFeature.startFrame;

  // Clean entrance
  const enter = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Clean exit
  const exit = interpolate(localFrame, [duration - 8, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const opacity = enter * (1 - exit);
  const translateY = interpolate(enter, [0, 1], [-18, 0]) + interpolate(exit, [0, 1], [0, -15]);

  const colors = BADGE_COLORS[activeFeature.tagColor] || BADGE_COLORS.orange;
  const IconComponent = ICON_MAP[activeFeature.icon] || Sparkles;

  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 36,
        width: 650,
        zIndex: 85,
        display: "flex",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(20px)",
          borderRadius: 22,
          padding: "16px 20px",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.15)",
          width: "100%",
        }}
      >
        {/* Clean Icon Box */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: colors.pillBg,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 6px 16px ${colors.pillBg}40`,
          }}
        >
          <IconComponent size={28} />
        </div>

        {/* Text Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#111113", letterSpacing: "-0.02em" }}>
              {activeFeature.title}
            </span>
            <span
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                fontSize: 15,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 9999,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {activeFeature.tag}
            </span>
          </div>
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#4b5563",
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            {activeFeature.description}
          </p>
        </div>
      </div>
    </div>
  );
};
