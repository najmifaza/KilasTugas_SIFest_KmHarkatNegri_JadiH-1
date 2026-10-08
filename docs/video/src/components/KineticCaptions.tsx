import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SUBTITLES, Subtitle } from "../timelineData";

export const KineticCaptions: React.FC = () => {
  const frame = useCurrentFrame();

  const currentSub: Subtitle | undefined = SUBTITLES.find(
    (sub) => frame >= sub.startFrame && frame < sub.endFrame
  );

  if (!currentSub) return null;

  const localFrame = frame - currentSub.startFrame;
  const duration = currentSub.endFrame - currentSub.startFrame;

  // Smooth fade and slide up
  const enter = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exit = interpolate(localFrame, [duration - 6, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = enter * (1 - exit);
  const translateY = interpolate(enter, [0, 1], [14, 0]);

  // Dynamic font size for clean 1-2 line presentation
  const textLen = currentSub.text.length;
  const fontSize = textLen > 75 ? 36 : textLen > 45 ? 40 : 44;

  // Clean, elegant highlighting without cartoonish stickers
  const renderTokens = () => {
    if (!currentSub.highlightWords || currentSub.highlightWords.length === 0) {
      return <span>{currentSub.text}</span>;
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

    return parts.map((part, i) =>
      part.isHighlight ? (
        <span
          key={i}
          style={{
            color: "#fb923c", // Warm brand orange
            fontWeight: 800,
            textShadow: "0 0 16px rgba(234, 88, 12, 0.35)",
          }}
        >
          {part.text}
        </span>
      ) : (
        <span key={i} style={{ color: "#ffffff" }}>
          {part.text}
        </span>
      )
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60, // Lower third baseline
        left: 36,
        right: 36,
        zIndex: 85,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(17, 17, 19, 0.88)",
          backdropFilter: "blur(20px)",
          borderRadius: 22,
          padding: "16px 28px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 14px 36px rgba(0, 0, 0, 0.35)",
          textAlign: "center",
          maxWidth: 960,
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize,
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            margin: 0,
            wordBreak: "break-word",
          }}
        >
          {renderTokens()}
        </p>
      </div>
    </div>
  );
};
