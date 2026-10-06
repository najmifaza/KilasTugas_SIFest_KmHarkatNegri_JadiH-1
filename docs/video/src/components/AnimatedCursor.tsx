import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Audio,
  staticFile,
} from "remotion";

interface AnimatedCursorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startFrame: number;
  clickFrame?: number;
}

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  startX,
  startY,
  endX,
  endY,
  startFrame,
  clickFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Move progress
  const moveSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, mass: 0.8 },
  });

  const currentX = interpolate(moveSpring, [0, 1], [startX, endX]);
  const currentY = interpolate(moveSpring, [0, 1], [startY, endY]);

  // Click pulse animation
  const isClicking = clickFrame !== undefined && frame >= clickFrame;
  const clickSpring = isClicking
    ? spring({
        frame: frame - clickFrame,
        fps,
        config: { damping: 10, mass: 0.5 },
      })
    : 0;

  const cursorScale = isClicking
    ? interpolate(clickSpring, [0, 0.4, 1], [1, 0.8, 1])
    : 1;

  const rippleScale = isClicking
    ? interpolate(clickSpring, [0, 1], [0.5, 2.5])
    : 0;
  const rippleOpacity = isClicking
    ? interpolate(clickSpring, [0, 0.8, 1], [0.8, 0.4, 0])
    : 0;

  return (
    <>
      {/* Audio effect: haptic click */}
      {clickFrame !== undefined && (
        <Sequence from={clickFrame} durationInFrames={10}>
          <Audio src={staticFile("audio/click.wav")} volume={0.65} />
        </Sequence>
      )}

      {frame >= startFrame && (
        <div
          className="absolute pointer-events-none z-50 select-none"
          style={{
            left: `${currentX}%`,
            top: `${currentY}%`,
            transform: "translate(-3px, -3px)",
          }}
        >
          {/* Click ripple circle */}
          {isClicking && (
            <div
              className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-orange-500 bg-orange-400/20"
              style={{
                transform: `scale(${rippleScale})`,
                opacity: rippleOpacity,
              }}
            />
          )}

          {/* Modern Cursor SVG */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              transform: `scale(${cursorScale})`,
              filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.35))",
            }}
          >
            <path
              d="M3 3L10.07 20.97L12.58 13.58L19.97 11.07L3 3Z"
              fill="#111113"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </>
  );
};
