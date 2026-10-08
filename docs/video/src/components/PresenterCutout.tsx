import React from "react";
import { Video, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";

export const PresenterCutout: React.FC = () => {
  const frame = useCurrentFrame();

  // Opening: Fullscreen from 0 to 210, then smoothly transitions to corner (210 to 250)
  const introShrink = interpolate(frame, [210, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Closing: Corner expands smoothly back to fullscreen at 6930 to 6970
  const outroExpand = interpolate(frame, [6930, 6970], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // cornerProgress: 0 = Fullscreen, 1 = Corner Cutout
  const cornerProgress = introShrink * (1 - outroExpand);

  // Smooth interpolation of dimensions and positions
  const width = interpolate(cornerProgress, [0, 1], [1080, 260]);
  const height = interpolate(cornerProgress, [0, 1], [1920, 310]);
  const top = interpolate(cornerProgress, [0, 1], [0, 115]);
  const left = interpolate(cornerProgress, [0, 1], [0, 1080 - 260 - 32]);
  const borderRadius = interpolate(cornerProgress, [0, 1], [0, 22]);
  const borderWidth = interpolate(cornerProgress, [0, 1], [0, 2.5]);
  const shadowOpacity = interpolate(cornerProgress, [0, 1], [0, 0.45]);

  return (
    <div
      style={{
        position: "absolute",
        top: cornerProgress === 0 ? 0 : top,
        left: cornerProgress === 1 ? undefined : cornerProgress === 0 ? 0 : left,
        right: cornerProgress === 1 ? 32 : undefined,
        width,
        height,
        borderRadius,
        overflow: "hidden",
        zIndex: cornerProgress === 0 ? 30 : 80,
        boxShadow: `0 14px 32px rgba(0, 0, 0, ${shadowOpacity})`,
        border: `${borderWidth}px solid #ffffff`,
      }}
    >
      <Video
        name="Voice Over Presenter"
        src={staticFile("VideoPenjelasanAplikasiKilasTugas.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: cornerProgress > 0 ? "center 20%" : "center center",
        }}
      />

      {/* Presenter badge tag only in corner mode */}
      {cornerProgress > 0.8 && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            backgroundColor: "rgba(17, 17, 19, 0.85)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
            padding: "3px 8px",
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 5,
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: "#22c55e" }} />
          <span>Demo Host</span>
        </div>
      )}
    </div>
  );
};
