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
import { Sparkles, ListFilter, Zap } from "lucide-react";
import { CinematicScreenView } from "../components/CinematicScreenView";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { FloatingBadge } from "../components/FloatingBadge";

export const RealDemo_01_InputAndBreakdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases (at 30fps):
  // 0-44:   Dashboard initial → cursor moves to + button
  // 45-89:  Modal open (02_modal_open.png) → camera zooms in
  // 90-134: Modal filled (03_modal_filled.png) → cursor moves to Create Task
  // 135+:   Dashboard with tasks (04_dashboard_with_tasks.png) + subtask list expanded (05_subtask_list.png)

  let currentImage = "real_captures/01_dashboard_initial.png";
  if (frame >= 45 && frame < 90) {
    currentImage = "real_captures/02_modal_open.png";
  } else if (frame >= 90 && frame < 135) {
    currentImage = "real_captures/03_modal_filled.png";
  } else if (frame >= 135 && frame < 190) {
    currentImage = "real_captures/04_dashboard_with_tasks.png";
  } else if (frame >= 190) {
    currentImage = "real_captures/05_subtask_list.png";
  }

  // Camera movements
  let cameraScale = 1;
  let originX = 50;
  let originY = 50;
  let rotateY = 0;

  if (frame >= 45 && frame < 135) {
    // Zoom into the form modal
    const zoomSpring = spring({ frame: frame - 45, fps, config: { damping: 16 } });
    cameraScale = interpolate(zoomSpring, [0, 1], [1, 1.5]);
    originX = 50;
    originY = 58;
    rotateY = interpolate(zoomSpring, [0, 1], [0, -2]);
  } else if (frame >= 135 && frame < 190) {
    // Pull back — reveal the task card on the dashboard
    const revealSpring = spring({ frame: frame - 135, fps, config: { damping: 14 } });
    cameraScale = interpolate(revealSpring, [0, 1], [1.5, 1.1]);
    originX = 35;
    originY = 65;
    rotateY = interpolate(revealSpring, [0, 1], [-2, 0]);
  } else if (frame >= 190) {
    // Gentle pan down to show expanded subtask list
    const listSpring = spring({ frame: frame - 190, fps, config: { damping: 18 } });
    cameraScale = interpolate(listSpring, [0, 1], [1.1, 1.2]);
    originX = 35;
    originY = interpolate(listSpring, [0, 1], [65, 72]);
    rotateY = 0;
  }

  return (
    <>
      {/* Audio: Magical sparkle chime when AI breakdown appears */}
      <Sequence from={138} durationInFrames={45}>
        <Audio src={staticFile("audio/sparkle.wav")} volume={0.6} />
      </Sequence>

      <CinematicScreenView
        imageSrc={currentImage}
        scale={cameraScale}
        originX={originX}
        originY={originY}
        rotateY={rotateY}
      >
        {/* Cursor: move to + (Add Task) button on initial dashboard */}
        {frame < 44 && (
          <AnimatedCursor
            startX={40}
            startY={60}
            endX={84}
            endY={6}
            startFrame={8}
            clickFrame={42}
          />
        )}

        {/* Cursor: scroll down in modal then click "Create Task" at the very bottom */}
        {frame >= 90 && frame < 138 && (
          <AnimatedCursor
            startX={50}
            startY={25}
            endX={50}
            endY={92}
            startFrame={91}
            clickFrame={128}
          />
        )}

        {/* Cursor: click the ∨ expand chevron on the task card to open subtask list */}
        {frame >= 150 && frame < 192 && (
          <AnimatedCursor
            startX={35}
            startY={75}
            endX={48}
            endY={88}
            startFrame={152}
            clickFrame={185}
          />
        )}

        {/* Badge: label on initial dashboard — "Klik Tambah Tugas" */}
        {frame >= 12 && frame < 45 && (
          <FloatingBadge
            x={72}
            y={8}
            delay={12}
            title="Tambah Tugas Baru"
            subtitle="Klik + untuk buka formulir cerdas"
            themeColor="orange"
          />
        )}

        {/* Badge: while modal is open — "Input Instruksi" */}
        {frame >= 55 && frame < 135 && (
          <FloatingBadge
            x={50}
            y={10}
            delay={58}
            icon={<ListFilter className="w-4 h-4 text-orange-600" />}
            title="Input Instruksi Tugas"
            subtitle="Kategori + deskripsi silabus → AI urai otomatis"
            themeColor="orange"
          />
        )}

        {/* Badge: task card appears on dashboard */}
        {frame >= 140 && frame < 190 && (
          <FloatingBadge
            x={35}
            y={65}
            delay={142}
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            title="AI Breakdown Selesai"
            subtitle="6 langkah kerja konkret • 0/6 (0%) siap dikerjakan"
            themeColor="emerald"
          />
        )}

        {/* Badge: subtask list expanded */}
        {frame >= 195 && (
          <FloatingBadge
            x={35}
            y={78}
            delay={197}
            icon={<Zap className="w-4 h-4 text-orange-500" />}
            title="Micro-Pacing Siap Jalan"
            subtitle="Tiap langkah punya durasi & tanggal target"
            themeColor="orange"
          />
        )}
      </CinematicScreenView>
    </>
  );
};
