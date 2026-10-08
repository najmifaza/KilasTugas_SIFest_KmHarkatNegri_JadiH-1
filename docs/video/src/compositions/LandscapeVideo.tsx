import React from "react";
import { AbsoluteFill, Audio, Video, staticFile, useCurrentFrame } from "remotion";
import { VideoBackground } from "../components/VideoBackground";
import { ChapterHeader } from "../components/ChapterHeader";
import { FeatureCard } from "../components/FeatureCard";
import { SubtitleBar } from "../components/SubtitleBar";
import { RoadmapOverlay } from "../components/RoadmapOverlay";
import { OutroOverlay } from "../components/OutroOverlay";
import { CHAPTERS } from "../timelineData";
import { Check } from "lucide-react";

export const LandscapeVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* 1. Warm Editorial Canvas Background */}
      <VideoBackground />

      {/* 2. Soft Ambient Background Music */}
      <Audio
        name="Ambient BGM"
        src={staticFile("audio/bgm.wav")}
        volume={0.12}
      />

      {/* 3. Main Two-Column Cockpit Layout */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          padding: "36px 48px",
          gap: 44,
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Left Column: Framed Smartphone Screen */}
        <div
          style={{
            flex: "0 0 540px",
            height: "960px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Phone Bezel */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#111113",
              borderRadius: 48,
              padding: 12,
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22), 0 4px 16px rgba(0, 0, 0, 0.1)",
              border: "3px solid #27272a",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Dynamic Island / Notch */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                transform: "translateX(-50%)",
                width: 110,
                height: 24,
                backgroundColor: "#000000",
                borderRadius: 9999,
                zIndex: 40,
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            />

            {/* Inner Screen Video */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 38,
                overflow: "hidden",
                backgroundColor: "#000000",
                position: "relative",
              }}
            >
              <Video
                name="Smartphone Demo"
                src={staticFile("VideoPenjelasanAplikasiKilasTugas.mp4")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Context & Motion Companion Panel */}
        <div
          style={{
            flex: 1,
            height: "960px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top: Header */}
          <ChapterHeader layout="landscape" />

          {/* Middle: Feature Details / Roadmap / Outro */}
          <div style={{ flex: 1, margin: "24px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {frame >= 6930 ? (
              <OutroOverlay layout="landscape" />
            ) : frame >= 5610 ? (
              <RoadmapOverlay layout="landscape" />
            ) : (
              <div>
                <FeatureCard layout="landscape" />

                {/* Chapter Step Indicators */}
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 18,
                    padding: "16px 20px",
                    border: "1px solid rgba(229, 231, 235, 0.8)",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                    Alur Demonstrasi Produk
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {CHAPTERS.map((ch) => {
                      const isPast = frame >= ch.endFrame;
                      const isCurrent = frame >= ch.startFrame && frame < ch.endFrame;

                      return (
                        <div
                          key={ch.id}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 10,
                            backgroundColor: isCurrent ? "#fff7ed" : isPast ? "#f0fdf4" : "#f9fafb",
                            border: isCurrent
                              ? "2px solid #ea580c"
                              : isPast
                              ? "1px solid #bbf7d0"
                              : "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 9999,
                              backgroundColor: isCurrent ? "#ea580c" : isPast ? "#16a34a" : "#cbd5e1",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            {isPast ? <Check size={12} /> : ch.id}
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: isCurrent ? 800 : 600,
                              color: isCurrent ? "#ea580c" : isPast ? "#166534" : "#6b7280",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ch.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom: Live Subtitles */}
          <SubtitleBar layout="landscape" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
