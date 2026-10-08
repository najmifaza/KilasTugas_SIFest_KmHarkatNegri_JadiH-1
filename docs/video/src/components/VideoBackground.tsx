import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const VideoBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle breathing animation for background mesh
  const shiftX = interpolate(frame % 300, [0, 150, 300], [0, 20, 0]);
  const shiftY = interpolate(frame % 300, [0, 150, 300], [0, -15, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F3EFEA",
        backgroundImage: `
          radial-gradient(circle at ${10 + shiftX * 0.1}% ${8 + shiftY * 0.1}%, #F9D0C1 0%, transparent 48%),
          radial-gradient(circle at ${90 - shiftX * 0.1}% ${5 - shiftY * 0.1}%, #DCBFE6 0%, transparent 42%),
          radial-gradient(circle at 50% 95%, #FFE4D6 0%, transparent 50%)
        `,
        overflow: "hidden",
      }}
    >
      {/* Subtle modern dot matrix pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.25,
          backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </AbsoluteFill>
  );
};
