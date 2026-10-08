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

export const TopDynamicBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const currentChapter: Chapter =
    CHAPTERS.find((ch) => frame >= ch.startFrame && frame < ch.endFrame) || CHAPTERS[0];

  const localFrame = frame - currentChapter.startFrame;

  // Gentle pulse animation on chapter change
  const scale = interpolate(localFrame, [0, 8, 16], [0.97, 1.01, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const IconComponent = ICON_MAP[currentChapter.iconName] || Sparkles;

  const currentSec = Math.floor(frame / fps);
  const totalSec = Math.floor(durationInFrames / fps);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (frame / durationInFrames) * 100));

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 36,
        right: 36,
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgba(17, 17, 19, 0.90)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: "16px 26px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Left: Logo & App */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src={staticFile("logo.png")}
            alt="Logo"
            style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 12 }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                KilasTugas
              </span>
              <span
                style={{
                  backgroundColor: "#ea580c",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 800,
                  padding: "2px 10px",
                  borderRadius: 9999,
                  letterSpacing: "0.04em",
                }}
              >
                DEMO
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <IconComponent size={16} className="text-orange-400 inline" />
              <span>{currentChapter.badge}</span>
            </div>
          </div>
        </div>

        {/* Right: Chapter Title & Time */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#fb923c",
              letterSpacing: "-0.01em",
            }}
          >
            {currentChapter.title}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#94a3b8",
              fontFamily: "ui-monospace, monospace",
              marginTop: 2,
            }}
          >
            {formatTime(currentSec)} / {formatTime(totalSec)}
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div
        style={{
          height: 5,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
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
};
