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

interface FeatureCardProps {
  layout?: "vertical" | "landscape";
}

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

const COLOR_STYLES = {
  orange: {
    bg: "rgba(255, 247, 237, 0.95)",
    border: "#ffedd5",
    tagBg: "#ea580c",
    tagText: "#ffffff",
    title: "#9a3412",
  },
  green: {
    bg: "rgba(240, 253, 244, 0.95)",
    border: "#dcfce7",
    tagBg: "#16a34a",
    tagText: "#ffffff",
    title: "#166534",
  },
  blue: {
    bg: "rgba(239, 246, 255, 0.95)",
    border: "#dbeafe",
    tagBg: "#2563eb",
    tagText: "#ffffff",
    title: "#1e40af",
  },
  purple: {
    bg: "rgba(250, 245, 255, 0.95)",
    border: "#f3e8ff",
    tagBg: "#9333ea",
    tagText: "#ffffff",
    title: "#6b21a8",
  },
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ layout = "vertical" }) => {
  const frame = useCurrentFrame();

  // Find active feature
  const activeFeature: FeatureHighlight | undefined = FEATURES.find(
    (feat) => frame >= feat.startFrame && frame < feat.endFrame
  );

  if (!activeFeature) return null;

  const duration = activeFeature.endFrame - activeFeature.startFrame;
  const localFrame = frame - activeFeature.startFrame;

  // Entrance animation (0 to 18 frames)
  const enterProgress = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Exit animation (last 15 frames)
  const exitProgress = interpolate(localFrame, [duration - 15, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const opacity = enterProgress * (1 - exitProgress);
  const translateY = interpolate(enterProgress, [0, 1], [30, 0]) + interpolate(exitProgress, [0, 1], [0, -20]);
  const scale = interpolate(enterProgress, [0, 1], [0.94, 1]) * interpolate(exitProgress, [0, 1], [1, 0.96]);

  const style = COLOR_STYLES[activeFeature.tagColor] || COLOR_STYLES.orange;
  const IconComponent = ICON_MAP[activeFeature.icon] || Sparkles;

  if (layout === "vertical") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 220, // Sits comfortably above captions
          left: 36,
          right: 36,
          zIndex: 60,
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            borderRadius: 22,
            padding: "18px 22px",
            border: `1.5px solid ${style.border}`,
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: style.tagBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <IconComponent size={18} />
              </div>
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: "#111113",
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                {activeFeature.title}
              </h3>
            </div>

            <span
              style={{
                backgroundColor: style.tagBg,
                color: style.tagText,
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 9999,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              {activeFeature.tag}
            </span>
          </div>

          <p
            style={{
              fontSize: 14,
              color: "#4b5563",
              lineHeight: 1.45,
              margin: 0,
              fontWeight: 500,
            }}
          >
            {activeFeature.description}
          </p>
        </div>
      </div>
    );
  }

  // Landscape Layout (side panel widget)
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        padding: "20px 24px",
        border: `1.5px solid ${style.border}`,
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: style.tagBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            <IconComponent size={20} />
          </div>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#111113",
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {activeFeature.title}
          </h3>
        </div>

        <span
          style={{
            backgroundColor: style.tagBg,
            color: style.tagText,
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 9999,
          }}
        >
          {activeFeature.tag}
        </span>
      </div>

      <p
        style={{
          fontSize: 15,
          color: "#4b5563",
          lineHeight: 1.5,
          margin: 0,
          fontWeight: 500,
        }}
      >
        {activeFeature.description}
      </p>
    </div>
  );
};
