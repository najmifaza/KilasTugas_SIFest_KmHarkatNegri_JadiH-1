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
import { Timer, TrendingUp, CheckCircle2 } from "lucide-react";
import { CinematicScreenView } from "../components/CinematicScreenView";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { FloatingBadge } from "../components/FloatingBadge";

export const RealDemo_02_FocusAndPacing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases (at 30fps):
  // 0-44:   Subtask list expanded (05_subtask_list.png) → cursor hovers over a subtask row
  // 45-124: Task detail + Pomodoro timer modal (07_timer_running.png) → zoomed in
  // 125+:   Progress updated (06_progress_updated.png) → 1/6 (17%) bar + checked subtask
  //         Camera pans to hero progress ring

  let currentImage = "real_captures/05_subtask_list.png";
  if (frame >= 45 && frame < 125) {
    currentImage = "real_captures/07_timer_running.png";
  } else if (frame >= 125) {
    currentImage = "real_captures/06_progress_updated.png";
  }

  let cameraScale = 1.05;
  let originX = 35;
  let originY = 70;
  let rotateX = 0;

  if (frame >= 45 && frame < 125) {
    // Zoom into the Pomodoro timer modal (center-right)
    const timerZoom = spring({ frame: frame - 45, fps, config: { damping: 16 } });
    cameraScale = interpolate(timerZoom, [0, 1], [1.05, 1.4]);
    originX = 50;
    originY = 55;
    rotateX = interpolate(timerZoom, [0, 1], [0, 1]);
  } else if (frame >= 125) {
    // Pan up to the task card progress bar
    const progressZoom = spring({ frame: frame - 125, fps, config: { damping: 15 } });
    cameraScale = interpolate(progressZoom, [0, 1], [1.4, 1.2]);
    originX = 35;
    originY = interpolate(progressZoom, [0, 1], [55, 72]);
    rotateX = interpolate(progressZoom, [0, 1], [1, 0]);
  }

  return (
    <>
      {/* Audio: Success chord chime when subtask is completed & progress advances */}
      <Sequence from={125} durationInFrames={40}>
        <Audio src={staticFile("audio/success.wav")} volume={0.65} />
      </Sequence>

      <CinematicScreenView
        imageSrc={currentImage}
        scale={cameraScale}
        originX={originX}
        originY={originY}
        rotateX={rotateX}
      >
        {/* Cursor: click on subtask row 01 "Baca & pahami" to open detail */}
        {frame < 45 && (
          <AnimatedCursor
            startX={35}
            startY={55}
            endX={50}
            endY={61}
            startFrame={5}
            clickFrame={38}
          />
        )}

        {/* Cursor: click "Mulai Fokus" play button at bottom of timer modal */}
        {frame >= 55 && frame < 122 && (
          <AnimatedCursor
            startX={50}
            startY={45}
            endX={48}
            endY={90}
            startFrame={58}
            clickFrame={95}
          />
        )}

        {/* Badge: on subtask list — prompt to click a step */}
        {frame >= 8 && frame < 45 && (
          <FloatingBadge
            x={50}
            y={64}
            delay={10}
            icon={<Timer className="w-4 h-4 text-orange-600" />}
            title="Klik Langkah Kerja"
            subtitle="Buka detail + timer Pomodoro bawaan"
            themeColor="orange"
          />
        )}

        {/* Badge: inside timer modal — "Timer Fokus Pomodoro" */}
        {frame >= 50 && frame < 125 && (
          <FloatingBadge
            x={50}
            y={12}
            delay={52}
            icon={<Timer className="w-4 h-4 text-orange-600" />}
            title="Timer Fokus Pomodoro"
            subtitle="30:00 per langkah • Panduan pengerjaan AI ada di sini"
            themeColor="orange"
          />
        )}

        {/* Badge: progress bar shows 1/6 (17%) */}
        {frame >= 130 && (
          <FloatingBadge
            x={35}
            y={75}
            delay={132}
            icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
            title="Progres Naik: 1/6 (17%)"
            subtitle="Sub-tugas dicentang → bar langsung update"
            themeColor="emerald"
          />
        )}

        {/* Secondary badge: shows checked subtask */}
        {frame >= 155 && (
          <FloatingBadge
            x={35}
            y={84}
            delay={157}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            title="Langkah 01 Selesai ✓"
            subtitle="Baca & pahami modul praktikum — done"
            themeColor="emerald"
          />
        )}
      </CinematicScreenView>
    </>
  );
};
