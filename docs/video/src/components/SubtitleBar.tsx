import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SUBTITLES, Subtitle } from "../timelineData";

interface SubtitleBarProps {
  layout?: "vertical" | "landscape";
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({ layout = "vertical" }) => {
  const frame = useCurrentFrame();

  const currentSub: Subtitle | undefined = SUBTITLES.find(
    (sub) => frame >= sub.startFrame && frame < sub.endFrame
  );

  if (!currentSub) return null;

  const localFrame = frame - currentSub.startFrame;
  const duration = currentSub.endFrame - currentSub.startFrame;

  // Snappy fade in
  const enter = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Smooth fade out
  const exit = interpolate(localFrame, [duration - 6, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = enter * (1 - exit);
  const translateY = interpolate(enter, [0, 1], [10, 0]);

  // Highlight words
  const renderHighlightedText = () => {
    if (!currentSub.highlightWords || currentSub.highlightWords.length === 0) {
      return currentSub.text;
    }

    let parts: Array<{ text: string; isHighlight: boolean }> = [
      { text: currentSub.text, isHighlight: false },
    ];

    for (const hw of currentSub.highlightWords) {
      const nextParts: Array<{ text: string; isHighlight: boolean }> = [];
      for (const part of parts) {
        if (part.isHighlight) {
          nextParts.push(part);
          continue;
        }

        const idx = part.text.toLowerCase().indexOf(hw.toLowerCase());
        if (idx !== -1) {
          const before = part.text.substring(0, idx);
          const match = part.text.substring(idx, idx + hw.length);
          const after = part.text.substring(idx + hw.length);

          if (before) nextParts.push({ text: before, isHighlight: false });
          nextParts.push({ text: match, isHighlight: true });
          if (after) nextParts.push({ text: after, isHighlight: false });
        } else {
          nextParts.push(part);
        }
      }
      parts = nextParts;
    }

    return parts.map((p, i) =>
      p.isHighlight ? (
        <span
          key={i}
          style={{
            backgroundColor: "#ea580c",
            color: "#ffffff",
            padding: "2px 7px",
            borderRadius: 6,
            fontWeight: 800,
            display: "inline-block",
            margin: "0 2px",
            boxShadow: "0 2px 6px rgba(234, 88, 12, 0.35)",
          }}
        >
          {p.text}
        </span>
      ) : (
        <span key={i}>{p.text}</span>
      )
    );
  };

  if (layout === "vertical") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 28,
          right: 28,
          zIndex: 80,
          display: "flex",
          justifyContent: "center",
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(17, 17, 19, 0.88)",
            backdropFilter: "blur(14px)",
            color: "#ffffff",
            padding: "16px 24px",
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.5,
            textAlign: "center",
            maxWidth: 960,
            width: "100%",
          }}
        >
          {renderHighlightedText()}
        </div>
      </div>
    );
  }

  // Landscape
  return (
    <div
      style={{
        backgroundColor: "rgba(17, 17, 19, 0.92)",
        backdropFilter: "blur(14px)",
        color: "#ffffff",
        padding: "16px 24px",
        borderRadius: 18,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.2)",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.5,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        Live Transkrip
      </div>
      <div>{renderHighlightedText()}</div>
    </div>
  );
};
