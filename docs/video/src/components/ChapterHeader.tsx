import React from "react";
import { staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
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
import { CHAPTERS, Chapter } from "../timelineData";

interface ChapterHeaderProps {
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

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({ layout = "vertical" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Find active chapter
  const currentChapter: Chapter =
    CHAPTERS.find((ch) => frame >= ch.startFrame && frame < ch.endFrame) || CHAPTERS[0];

  // Chapter entrance animation within its block
  const localFrame = frame - currentChapter.startFrame;
  const slideY = interpolate(localFrame, [0, 15], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const IconComponent = ICON_MAP[currentChapter.iconName] || Zap;

  // Format time (MM:SS)
  const currentSec = Math.floor(frame / fps);
  const totalSec = Math.floor(durationInFrames / fps);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (frame / durationInFrames) * 100));

  if (layout === "vertical") {
    return (
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 32,
          right: 32,
          zIndex: 50,
          opacity,
          transform: `translateY(${slideY}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            borderRadius: 24,
            padding: "16px 24px",
            border: "1px solid rgba(229, 231, 235, 0.9)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo & App title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src={staticFile("logo.png")}
              alt="Logo"
              style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 10 }}
            />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#111113",
                    letterSpacing: "-0.02em",
                  }}
                >
                  KilasTugas
                </span>
                <span
                  style={{
                    backgroundColor: "#ffedd5",
                    color: "#ea580c",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 9999,
                    letterSpacing: "0.05em",
                  }}
                >
                  LIVE DEMO
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6b7280",
                  marginTop: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <IconComponent size={14} className="text-orange-600 inline" />
                <span>{currentChapter.title}</span>
              </div>
            </div>
          </div>

          {/* Time & Chapter Pill */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 9999,
                fontFamily: "ui-monospace, monospace",
                display: "inline-block",
              }}
            >
              {currentChapter.badge}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#9ca3af",
                marginTop: 3,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {formatTime(currentSec)} / {formatTime(totalSec)}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div
          style={{
            marginTop: 8,
            height: 4,
            backgroundColor: "rgba(229, 231, 235, 0.7)",
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor: "#ea580c",
              borderRadius: 9999,
            }}
          />
        </div>
      </div>
    );
  }

  // Landscape Layout (1920x1080)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(16px)",
        borderRadius: 20,
        border: "1px solid rgba(229, 231, 235, 0.9)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img
          src={staticFile("logo.png")}
          alt="Logo"
          style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 10 }}
        />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#111113" }}>
              KilasTugas
            </span>
            <span
              style={{
                backgroundColor: "#ffedd5",
                color: "#ea580c",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 9999,
              }}
            >
              SIFest 2026
            </span>
          </div>
          <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
            Smart Actionable Task Breakdown & Micro-Pacing
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#fff7ed",
            border: "1px solid #ffedd5",
            padding: "6px 14px",
            borderRadius: 9999,
          }}
        >
          <IconComponent size={16} className="text-orange-600 inline" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#ea580c" }}>
            {currentChapter.badge}: {currentChapter.title}
          </span>
        </div>
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 13,
            fontWeight: 700,
            color: "#4b5563",
          }}
        >
          {formatTime(currentSec)} / {formatTime(totalSec)}
        </span>
      </div>
    </div>
  );
};
