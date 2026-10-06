import React from "react";
import { Series, Audio, Sequence, staticFile } from "remotion";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_Problem } from "./scenes/Scene2_Problem";
import { Scene3_SolutionPillars } from "./scenes/Scene3_SolutionPillars";
import { RealDemo_01_InputAndBreakdown } from "./scenes/RealDemo_01_InputAndBreakdown";
import { RealDemo_02_FocusAndPacing } from "./scenes/RealDemo_02_FocusAndPacing";
import { RealDemo_03_MobileCockpitAndSync } from "./scenes/RealDemo_03_MobileCockpitAndSync";
import { Scene7_Architecture } from "./scenes/Scene7_Architecture";
import { Scene8_RoadmapClosing } from "./scenes/Scene8_RoadmapClosing";

// Scene schedule (30fps):
// Scene 1 Intro:         0   - 150 (5s)
// Scene 2 Problem:       150 - 390 (8s)
// Scene 3 Solution:      390 - 600 (7s)
// Demo 1 Breakdown:      600 - 900 (10s)
// Demo 2 Focus/Pacing:   900 - 1170 (9s)
// Demo 3 Mobile/Sync:    1170 - 1440 (9s)
// Scene 7 Architecture:  1440 - 1650 (7s)
// Scene 8 Closing:       1650 - 1890 (8s)
// TOTAL:                 1890 frames (63s)

const TRANSITION_FRAMES = [148, 388, 598, 898, 1168, 1438, 1648];

export const MainVideo: React.FC = () => {
  return (
    <>
      {/* 🎵 Ambient Tech Product Demo Background Music */}
      <Audio src={staticFile("audio/bgm.wav")} volume={0.35} />

      {/* 💨 Whoosh transitions between scenes */}
      {TRANSITION_FRAMES.map((f) => (
        <Sequence key={f} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/whoosh.wav")} volume={0.4} />
        </Sequence>
      ))}

      {/* Master Scene Flow */}
      <Series>
        {/* 1. Opening Title & SIFest Badge (5s) */}
        <Series.Sequence durationInFrames={150}>
          <Scene1_Intro />
        </Series.Sequence>

        {/* 2. Problem Statement & Survey Validation (8s) */}

        {/* 3. Solution Philosophy & 4 Pillars (7s) */}

        {/* 4. REAL APP DEMO: Task Input → AI Breakdown (10s) */}
        <Series.Sequence durationInFrames={300}>
          <RealDemo_01_InputAndBreakdown />
        </Series.Sequence>

        {/* 5. REAL APP DEMO: Micro-Pacing & Pomodoro Focus Timer (9s) */}
        <Series.Sequence durationInFrames={270}>
          <RealDemo_02_FocusAndPacing />
        </Series.Sequence>

        {/* 6. REAL APP DEMO: Calendar Export & Mobile Responsive (9s) */}
        <Series.Sequence durationInFrames={270}>
          <RealDemo_03_MobileCockpitAndSync />
        </Series.Sequence>

        {/* 7. Architecture & Reliability (7s) */}
        <Series.Sequence durationInFrames={210}>
          <Scene7_Architecture />
        </Series.Sequence>

        {/* 8. Roadmap Grand Final & Closing Outro (8s) */}
        <Series.Sequence durationInFrames={240}>
          <Scene8_RoadmapClosing />
        </Series.Sequence>
      </Series>
    </>
  );
};
